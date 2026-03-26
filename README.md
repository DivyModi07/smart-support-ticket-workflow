# Smart Support Ticket Workflow

An AI-powered React web application that automates customer support ticket processing through a 3-step LLM workflow — all running directly in the browser with no backend required.

## Overview

This application simulates a smart customer support automation system. When a support agent enters a customer ticket, it runs through a sequential AI pipeline that:

1. **Classifies** the issue category and urgency level
2. **Generates** a personalized customer reply
3. **Decides** whether to escalate the ticket to a human agent

Each step is visible on screen in real time, and all processed tickets are logged in a session-based ticket history.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React.js | Frontend UI framework |
| Vanilla CSS | Styling and design system |
| OpenRouter API | LLM gateway for AI processing |
| Mistral 7B Instruct | LLM model (`mistralai/mistral-7b-instruct-v0.1`) |

## Features

- **Ticket Submission Form** — 4 required fields (Name, Email, Subject, Message) with inline validation
- **3-Step AI Workflow** — Classification → Reply Generation → Escalation Check, each visible as it processes
- **Real-Time Progress Tracker** — Visual indicator showing pending, running, and completed steps
- **Classification Display** — Category label + color-coded urgency badge (Green/Orange/Red)
- **Reply Generation** — AI-crafted customer reply with tone adaptation based on urgency, word count validation (80-120 words), and one-click copy to clipboard
- **Escalation Decision** — Green/Red banner with reasoning. High urgency tickets are auto-escalated with a visible override notice
- **Session Ticket Log** — Expandable history of all processed tickets with full details
- **Form Reset** — "New Ticket" button to clear form and process another ticket

## Project Structure

```
src/
├── App.js                        # Root component — orchestrates form, workflow, and log
├── App.css                       # Complete design system and styles
├── prompts.js                    # Prompt templates as named exported functions
├── hooks/
│   └── useLLMWorkflow.js         # Custom hook — all LLM API logic (no API calls in components)
├── components/
│   ├── TicketForm.jsx            # Ticket input form with inline validation
│   ├── WorkflowProgress.jsx      # 3-step visual progress tracker
│   ├── ClassificationResult.jsx  # Category and urgency badge display
│   ├── ReplyCard.jsx             # Generated reply card with copy button
│   ├── EscalationResult.jsx      # Escalation decision banner
│   └── TicketLog.jsx             # Session log of all processed tickets
```

## Architecture Decisions

- **All LLM logic** is isolated in `useLLMWorkflow.js` custom hook — components never make API calls directly
- **All prompt templates** are in `prompts.js` as named exports — easy to iterate on prompt engineering without touching React code
- **JSON-based LLM responses** — Classification and escalation steps enforce strict JSON output for reliable parsing
- **Value normalization** — LLM responses are normalized to consistent casing (e.g., `"low"` → `"Low"`) to ensure correct badge styling and logic
- **Hard escalation rule** — High urgency tickets are always escalated regardless of LLM decision, enforced in code as a business rule

## The 3-Step Workflow

### Step 1: Classification
- Classifies ticket into one of 5 categories: `Billing`, `Technical`, `Account`, `Feature Request`, `Other`
- Rates urgency as `Low`, `Medium`, or `High` based on tone and content
- Returns structured JSON: `{"category": "...", "urgency": "...", "reasoning": "..."}`

### Step 2: Reply Generation
- Generates a professional, empathetic customer-facing email reply
- Tone adapts based on urgency:
  - **High** → Apologetic and urgent
  - **Medium** → Warm and attentive
  - **Low** → Friendly and professional
- Constrained to 80-120 words; shows a warning badge if out of range

### Step 3: Escalation Check
- Evaluates whether the ticket needs human agent intervention
- Returns: `{"escalate": true/false, "reason": "..."}`
- **Hard rule**: Any ticket with `High` urgency is auto-escalated with a visible override notice

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm
- An OpenRouter API key ([get one free here](https://openrouter.ai/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DivyModi07/smart-support-ticket-workflow.git
   cd smart-support-ticket-workflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```
   REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open the app**

   Navigate to `http://localhost:3000` in your browser.

## Sample Test Tickets

### Low Urgency — Feature Request
- **Name:** Sarah Johnson
- **Subject:** Add dark mode to the dashboard
- **Message:** Hi, I've been using your platform for a few months now and I really enjoy it. It would be great if you could add a dark mode option to the dashboard. My eyes get tired during late-night sessions. Just a suggestion for future updates. Thanks!

### Medium Urgency — Account
- **Name:** Lisa Brown
- **Subject:** App notifications not working
- **Message:** Hi, I noticed that I stopped receiving push notifications from the app about three days ago. I've checked my phone settings and notifications are enabled. It's not super urgent but I rely on them to stay updated on project changes. Could you look into why they stopped? Thanks!

### High Urgency — Technical
- **Name:** Priya Sharma
- **Subject:** Production server down — cannot access any data
- **Message:** Our entire team is locked out of the system since this morning. We're getting a 503 error on every page and none of our critical data is accessible. This is severely impacting our business operations and we have a client deadline in 3 hours. We need this resolved IMMEDIATELY.
