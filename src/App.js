// App.jsx
// Root component that orchestrates the ticket workflow.
// Manages ticket log state and coordinates form submission with the LLM workflow hook.

import React, { useState, useRef } from 'react';
import TicketForm from './components/TicketForm';
import WorkflowProgress from './components/WorkflowProgress';
import ClassificationResult from './components/ClassificationResult';
import ReplyCard from './components/ReplyCard';
import EscalationResult from './components/EscalationResult';
import TicketLog from './components/TicketLog';
import useLLMWorkflow from './hooks/useLLMWorkflow';
import './App.css';

function App() {
  // Session-level ticket log: persists across multiple submissions
  const [ticketLog, setTicketLog] = useState([]);
  // Controls whether the results section is visible
  const [showResults, setShowResults] = useState(false);
  // Ref to access TicketForm's resetForm method
  const formRef = useRef(null);

  const {
    processTicket,
    stepStatuses,
    classification,
    reply,
    escalation,
    isProcessing,
    error,
    STATUS,
    resetWorkflow
  } = useLLMWorkflow();

  // Handles form submission: runs the 3-step workflow and appends to the log
  const handleSubmit = async (ticketData) => {
    setShowResults(true);

    try {
      const result = await processTicket(ticketData);
      // Append completed ticket to session log
      setTicketLog(prev => [...prev, result]);
    } catch (err) {
      // Error is already captured in the hook state
      console.error('Workflow failed:', err.message);
    }
  };

  // Check if any step has progressed beyond pending to show progress bar
  const hasStarted = Object.values(stepStatuses).some(s => s !== STATUS.PENDING);

  // Workflow is done when all 3 steps are completed or an error occurred
  const isWorkflowDone = !isProcessing && showResults && (escalation !== null || error);

  // Resets form fields and clears the results panel for a new submission
  const handleNewTicket = () => {
    if (formRef.current) formRef.current.resetForm();
    setShowResults(false);
    resetWorkflow();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="4" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 9l12 7 12-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1>Smart Support</h1>
              <p className="header-tagline">AI-Powered Ticket Workflow</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-pill">
              <span className="stat-number">{ticketLog.length}</span>
              <span className="stat-label">Processed</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="main-content">
          {/* Left panel: ticket form */}
          <section className="form-section">
            <TicketForm ref={formRef} onSubmit={handleSubmit} isProcessing={isProcessing} />
          </section>

          {/* Right panel: workflow results */}
          <section className={`results-section ${showResults ? 'visible' : ''}`}>
            {hasStarted && (
              <WorkflowProgress stepStatuses={stepStatuses} />
            )}

            {error && (
              <div className="error-banner fade-in">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 5v5M9 12.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Display each step result as it becomes available */}
            {classification && (
              <ClassificationResult classification={classification} />
            )}
            {reply && (
              <ReplyCard reply={reply} />
            )}
            {escalation && (
              <EscalationResult escalation={escalation} />
            )}

            {/* New Ticket button appears after workflow completes */}
            {isWorkflowDone && !error && (
              <button
                type="button"
                className="new-ticket-btn fade-in"
                onClick={handleNewTicket}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                New Ticket
              </button>
            )}

            {/* Prompt area when no processing has started */}
            {!showResults && (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 18h36M16 26h16M16 32h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>No ticket processed yet</h3>
                <p>Submit a support ticket to see the AI workflow in action</p>
              </div>
            )}
          </section>
        </div>

        {/* Ticket log section below the main panels */}
        <TicketLog tickets={ticketLog} />
      </main>
    </div>
  );
}

export default App;
