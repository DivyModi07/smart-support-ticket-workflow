// TicketLog.jsx
// Displays a session log of all processed tickets below the form.
// Each entry shows summary info with an expandable detail view.
// Log persists in React state across multiple ticket submissions.

import React, { useState } from 'react';

// Maps urgency to badge class for consistent styling across components
const URGENCY_CLASSES = {
  Low: 'urgency-low',
  Medium: 'urgency-medium',
  High: 'urgency-high'
};

function LogEntry({ entry, index }) {
  const [expanded, setExpanded] = useState(false);

  const { ticket, classification, reply, escalation, timestamp } = entry;

  return (
    <div className="log-entry">
      <div className="log-summary" onClick={() => setExpanded(!expanded)}>
        <div className="log-summary-left">
          <span className="log-index">#{index + 1}</span>
          <div className="log-info">
            <span className="log-name">{ticket.customerName}</span>
            <span className="log-subject">{ticket.subject}</span>
          </div>
        </div>
        <div className="log-summary-right">
          <span className="category-badge small">{classification.category}</span>
          <span className={`urgency-badge small ${URGENCY_CLASSES[classification.urgency]}`}>
            {classification.urgency}
          </span>
          <span className={`escalation-status-badge ${escalation.escalate ? 'escalated' : 'not-escalated'}`}>
            {escalation.escalate ? 'Escalated' : 'Resolved'}
          </span>
          <button
            className="view-detail-btn"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            type="button"
          >
            {expanded ? 'Hide Details' : 'View Details'}
            <svg
              width="12" height="12" viewBox="0 0 12 12"
              className={`chevron ${expanded ? 'open' : ''}`}
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="log-details fade-in">
          <div className="log-detail-section">
            <h4>Classification</h4>
            <p><strong>Category:</strong> {classification.category}</p>
            <p><strong>Urgency:</strong> {classification.urgency}</p>
            <p><strong>Reasoning:</strong> {classification.reasoning}</p>
          </div>
          <div className="log-detail-section">
            <h4>Generated Reply</h4>
            <p className="log-reply-text">{reply.text}</p>
            <span className="word-count">{reply.wordCount} words</span>
          </div>
          <div className="log-detail-section">
            <h4>Escalation</h4>
            <p><strong>Decision:</strong> {escalation.escalate ? 'Escalated' : 'Not Escalated'}</p>
            <p><strong>Reason:</strong> {escalation.reason}</p>
            {escalation.wasOverridden && (
              <p className="override-note">Auto-escalated due to high urgency</p>
            )}
          </div>
          <div className="log-timestamp">Processed at {timestamp}</div>
        </div>
      )}
    </div>
  );
}

export default function TicketLog({ tickets }) {
  if (!tickets || tickets.length === 0) return null;

  return (
    <div className="ticket-log">
      <div className="log-header">
        <h2>Processed Tickets</h2>
        <span className="log-count">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="log-list">
        {/* Show newest tickets first */}
        {[...tickets].reverse().map((entry, i) => (
          <LogEntry key={tickets.length - 1 - i} entry={entry} index={tickets.length - 1 - i} />
        ))}
      </div>
    </div>
  );
}
