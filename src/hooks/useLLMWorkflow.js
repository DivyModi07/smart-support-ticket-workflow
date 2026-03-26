// useLLMWorkflow.js
// Custom hook that encapsulates all 3 LLM API calls for the ticket workflow.
// No API calls should exist outside this hook.

import { useState, useCallback } from 'react';
import {
  buildClassificationPrompt,
  buildReplyPrompt,
  buildEscalationPrompt
} from '../prompts';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'mistralai/mistral-7b-instruct-v0.1';

// Sends a chat completion request to OpenRouter and returns the text response.
// Handles both system and user message roles.
async function callLLM(systemPrompt, userPrompt) {
  const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Smart Support Ticket Workflow'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 512
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

// Extracts JSON from an LLM response string.
// Handles cases where the model wraps JSON in markdown code blocks or extra text.
function extractJSON(text) {
  // Try to find JSON block within markdown code fences
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return JSON.parse(codeBlockMatch[1].trim());
  }

  // Try to find a raw JSON object in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('No valid JSON found in LLM response');
}

// Workflow step identifiers used for progress tracking
const STEPS = {
  CLASSIFY: 'classify',
  REPLY: 'reply',
  ESCALATE: 'escalate'
};

// Step status values for the progress indicator
const STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  ERROR: 'error'
};

export default function useLLMWorkflow() {
  // Track the status of each workflow step independently
  const [stepStatuses, setStepStatuses] = useState({
    [STEPS.CLASSIFY]: STATUS.PENDING,
    [STEPS.REPLY]: STATUS.PENDING,
    [STEPS.ESCALATE]: STATUS.PENDING
  });

  // Store results from each step
  const [classification, setClassification] = useState(null);
  const [reply, setReply] = useState(null);
  const [escalation, setEscalation] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Updates the status of a single step while preserving others
  const updateStep = useCallback((step, status) => {
    setStepStatuses(prev => ({ ...prev, [step]: status }));
  }, []);

  // Resets all state for a fresh workflow run
  const resetWorkflow = useCallback(() => {
    setStepStatuses({
      [STEPS.CLASSIFY]: STATUS.PENDING,
      [STEPS.REPLY]: STATUS.PENDING,
      [STEPS.ESCALATE]: STATUS.PENDING
    });
    setClassification(null);
    setReply(null);
    setEscalation(null);
    setError(null);
  }, []);

  // Step 1: Classify the ticket into a category and urgency level.
  // Returns parsed JSON with category, urgency, and reasoning.
  const classifyTicket = useCallback(async (ticketData) => {
    updateStep(STEPS.CLASSIFY, STATUS.RUNNING);
    try {
      const prompt = buildClassificationPrompt(ticketData);
      const responseText = await callLLM(prompt.system, prompt.user);
      console.log('[Step 1 - Classification] Raw response:', responseText);
      const result = extractJSON(responseText);
      console.log('[Step 1 - Classification] Parsed JSON:', result);

      // Validate expected fields exist in the response
      if (!result.category || !result.urgency || !result.reasoning) {
        throw new Error('Classification response missing required fields');
      }

      // Normalize urgency to capitalized form (e.g. "low" -> "Low")
      const urgencyMap = { low: 'Low', medium: 'Medium', high: 'High' };
      result.urgency = urgencyMap[result.urgency.toLowerCase()] || result.urgency;

      // Normalize category to title case (e.g. "billing" -> "Billing")
      const categoryMap = {
        billing: 'Billing',
        technical: 'Technical',
        account: 'Account',
        'feature request': 'Feature Request',
        other: 'Other'
      };
      result.category = categoryMap[result.category.toLowerCase()] || result.category;

      console.log('[Step 1 - Classification] Normalized:', result);

      setClassification(result);
      updateStep(STEPS.CLASSIFY, STATUS.COMPLETED);
      return result;
    } catch (err) {
      updateStep(STEPS.CLASSIFY, STATUS.ERROR);
      throw new Error(`Classification failed: ${err.message}`);
    }
  }, [updateStep]);

  // Step 2: Generate a personalized customer reply based on classification.
  // Reply tone adapts to urgency level per prompt instructions.
  const generateReply = useCallback(async (ticketData, classificationResult) => {
    updateStep(STEPS.REPLY, STATUS.RUNNING);
    try {
      const prompt = buildReplyPrompt({
        ...ticketData,
        category: classificationResult.category,
        urgency: classificationResult.urgency
      });
      const responseText = await callLLM(prompt.system, prompt.user);
      console.log('[Step 2 - Reply] Raw response:', responseText);

      // Count words to check the 80-120 word constraint
      const wordCount = responseText.split(/\s+/).filter(Boolean).length;
      const isOutOfRange = wordCount < 80 || wordCount > 120;
      console.log('[Step 2 - Reply] Word count:', wordCount, isOutOfRange ? '(out of range)' : '(within range)');

      const result = {
        text: responseText,
        wordCount,
        isOutOfRange
      };

      setReply(result);
      updateStep(STEPS.REPLY, STATUS.COMPLETED);
      return result;
    } catch (err) {
      updateStep(STEPS.REPLY, STATUS.ERROR);
      throw new Error(`Reply generation failed: ${err.message}`);
    }
  }, [updateStep]);

  // Step 3: Decide whether to escalate the ticket to a human agent.
  // Hard rule: High urgency tickets are always escalated regardless of LLM output.
  const checkEscalation = useCallback(async (ticketData, classificationResult) => {
    updateStep(STEPS.ESCALATE, STATUS.RUNNING);
    try {
      const prompt = buildEscalationPrompt({
        ...ticketData,
        category: classificationResult.category,
        urgency: classificationResult.urgency
      });
      const responseText = await callLLM(prompt.system, prompt.user);
      console.log('[Step 3 - Escalation] Raw response:', responseText);
      const result = extractJSON(responseText);
      console.log('[Step 3 - Escalation] Parsed JSON:', result);

      // Hard override: high urgency tickets must always escalate
      let wasOverridden = false;
      if (classificationResult.urgency === 'High' && !result.escalate) {
        result.escalate = true;
        result.reason = result.reason || 'Escalated due to high urgency.';
        wasOverridden = true;
      }

      const escalationResult = {
        escalate: result.escalate,
        reason: result.reason,
        wasOverridden
      };

      setEscalation(escalationResult);
      updateStep(STEPS.ESCALATE, STATUS.COMPLETED);
      return escalationResult;
    } catch (err) {
      updateStep(STEPS.ESCALATE, STATUS.ERROR);
      throw new Error(`Escalation check failed: ${err.message}`);
    }
  }, [updateStep]);

  // Runs the complete 3-step workflow sequentially.
  // Each step waits for the previous one to complete before starting.
  const processTicket = useCallback(async (ticketData) => {
    setIsProcessing(true);
    setError(null);
    resetWorkflow();

    try {
      // Step 1: classify
      const classResult = await classifyTicket(ticketData);

      // Brief pause so the user can see the classification result
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: generate reply using classification output
      const replyResult = await generateReply(ticketData, classResult);

      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: check escalation using classification output
      const escalationResult = await checkEscalation(ticketData, classResult);

      return {
        ticket: ticketData,
        classification: classResult,
        reply: replyResult,
        escalation: escalationResult,
        timestamp: new Date().toLocaleString()
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [resetWorkflow, classifyTicket, generateReply, checkEscalation]);

  return {
    processTicket,
    stepStatuses,
    classification,
    reply,
    escalation,
    isProcessing,
    error,
    resetWorkflow,
    STEPS,
    STATUS
  };
}
