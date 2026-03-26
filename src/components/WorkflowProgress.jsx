// WorkflowProgress.jsx
// Displays a visual 3-step progress indicator showing which workflow step
// is pending, running, or completed. Each step transitions visually in real time.

import React from 'react';

const STEP_CONFIG = [
  { key: 'classify', label: 'Classify Issue', icon: '1' },
  { key: 'reply', label: 'Generate Reply', icon: '2' },
  { key: 'escalate', label: 'Escalation Check', icon: '3' }
];

export default function WorkflowProgress({ stepStatuses }) {
  return (
    <div className="workflow-progress">
      <h3 className="workflow-title">Workflow Progress</h3>
      <div className="steps-track">
        {STEP_CONFIG.map((step, index) => {
          const status = stepStatuses[step.key];
          return (
            <React.Fragment key={step.key}>
              <div className={`step-item ${status}`}>
                <div className="step-circle">
                  {status === 'completed' ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : status === 'running' ? (
                    <span className="step-pulse" />
                  ) : status === 'error' ? (
                    <span className="step-error-icon">!</span>
                  ) : (
                    <span className="step-number">{step.icon}</span>
                  )}
                </div>
                <span className="step-label">{step.label}</span>
                {status === 'running' && <span className="step-running-text">Processing...</span>}
              </div>
              {index < STEP_CONFIG.length - 1 && (
                <div className={`step-connector ${stepStatuses[STEP_CONFIG[index + 1].key] !== 'pending' || status === 'completed' ? 'active' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
