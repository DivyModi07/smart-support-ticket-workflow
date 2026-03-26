// EscalationResult.jsx
// Displays the escalation decision as a prominent banner.
// Green banner for no escalation, red banner for escalation.
// Shows an override notice when high urgency forced escalation.

import React from 'react';

export default function EscalationResult({ escalation }) {
  if (!escalation) return null;

  const { escalate, reason, wasOverridden } = escalation;

  return (
    <div className="result-card escalation-card fade-in">
      <div className="result-card-header">
        <h3>Escalation Decision</h3>
      </div>

      <div className={`escalation-banner ${escalate ? 'escalate-yes' : 'escalate-no'}`}>
        <div className="escalation-icon">
          {escalate ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div className="escalation-text">
          <strong>{escalate ? 'Escalation Required' : 'No Escalation Needed'}</strong>
          <p>{reason}</p>
        </div>
      </div>

      {/* Override notice when high urgency forced the escalation */}
      {wasOverridden && (
        <div className="override-notice">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Auto-escalated due to high urgency
        </div>
      )}
    </div>
  );
}
