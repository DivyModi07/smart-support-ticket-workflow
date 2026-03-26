<div align="center">
  <img src="https://img.icons8.com/color/96/000000/bot.png" width="80" alt="Bot Icon" />
  <h1>Smart Support Ticket Workflow</h1>
  <p>An AI-powered React web application that automates customer support ticket processing through a <strong>3-step LLM workflow</strong> — running directly in your browser.</p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="#screenshots">Screenshots</a> •
    <a href="#installation">Installation</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Mistral_7B-4A90E2?style=for-the-badge&logoColor=white" alt="AI Model" />
    <img src="https://img.shields.io/badge/OpenRouter-FF5A5F?style=for-the-badge&logoColor=white" alt="API" />
  </p>
</div>

---

## ✨ Features

- **No Backend Architecture** — Direct, secure API calls to OpenRouter (`mistralai/mistral-7b-instruct-v0.1`) straight from the frontend.
- **Intelligent Classification** — Automatically categorizes tickets and ranks them by urgency level.
- **Context-Aware Replies** — Generates human-like, empathetic responses that adapt the tone based on the ticket's severity.
- **Auto-Escalation Engine** — Hard-coded business logic forces high-urgency tickets up to human agents, preventing critical misses.
- **Live Session Log** — A persistent, expandable history of all AI processing events available right below the form.

---

## 🛠️ How It Works

A support agent enters a customer query, and the app orchestrates three precise steps:

| Sequence | AI Action | Outcome/Display |
| :---: | :--- | :--- |
| **1** | **Classify Issue** | Tags it (`Billing`, `Technical`, etc.) & flags urgency (`🟢 Low`, `🟠 Medium`, `🔴 High`). |
| **2** | **Generate Reply** | Drafts a 80-120 word personalized response, complete with a word-count validator and copy-to-clipboard button. |
| **3** | **Check Escalation** | Determines if a human agent must intervene. High urgency triggers an **Auto-Escalate** lock. |

---

## 📸 Preview

Here's how the Smart Support workflow looks in action:

<p align="center">
  <img src="docs/Smart%20Support%20Ticket.jpeg" alt="Smart Support Ticket Workflow Demo" width="850" />
</p>

---

## 🚀 Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/DivyModi07/smart-support-ticket-workflow.git
cd smart-support-ticket-workflow
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up the Environment Variable**
Create a `.env` file in the root directory. Add your free OpenRouter API key:
```env
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
```
*(Get a free API key at [OpenRouter.ai](https://openrouter.ai/))*

**4. Start the app**
```bash
npm start
```
Go to `http://localhost:3000` to start processing tickets!

---

<p align="center">Built with ❤️ for modern customer support teams.</p>
