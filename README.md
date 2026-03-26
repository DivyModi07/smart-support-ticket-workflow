# Smart Support Ticket Workflow

A React web app that processes customer support tickets through a **3-step AI workflow** — classify, respond, and decide escalation — all running directly in the browser.

## Tech Stack

- **Frontend:** React.js + Vanilla CSS  
- **LLM:** Mistral 7B Instruct via OpenRouter API  
- **Architecture:** No backend — API calls made directly from the browser

## How It Works

A support agent enters a customer ticket, and the app runs it through 3 sequential LLM steps:

| Step | What It Does | Output |
|------|-------------|--------|
| **Classify** | Identifies issue category & urgency | Category badge + color-coded urgency (Green/Orange/Red) |
| **Generate Reply** | Writes a personalized customer email | Styled reply card with copy-to-clipboard |
| **Escalation Check** | Decides if a human agent is needed | Green (no) or Red (yes) banner with reasoning |

**Hard Rule:** High urgency tickets are always auto-escalated, regardless of LLM decision.

Each step is visible on screen as it processes, and all completed tickets are saved in a session log.

## Project Structure

```
src/
├── App.js                        # Root component
├── App.css                       # Design system & styles
├── prompts.js                    # Prompt templates (named exports)
├── hooks/
│   └── useLLMWorkflow.js         # Custom hook — all LLM logic here
├── components/
│   ├── TicketForm.jsx            # Form with inline validation
│   ├── WorkflowProgress.jsx      # 3-step progress tracker
│   ├── ClassificationResult.jsx  # Category + urgency display
│   ├── ReplyCard.jsx             # Reply + copy button + word count check
│   ├── EscalationResult.jsx      # Escalation banner + override notice
│   └── TicketLog.jsx             # Session history with expandable details
```

**Key rules followed:**
- All LLM calls isolated in `useLLMWorkflow.js` — no API logic in components
- All prompts in `prompts.js` — separated from business logic
- Short, accurate comments throughout the codebase

## Setup

```bash
git clone https://github.com/DivyModi07/smart-support-ticket-workflow.git
cd smart-support-ticket-workflow
npm install
```

Create a `.env` file in the root:
```
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Run the app:
```bash
npm start
```

Get a free API key at [openrouter.ai](https://openrouter.ai/)
