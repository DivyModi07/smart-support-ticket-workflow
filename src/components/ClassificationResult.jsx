// ClassificationResult.jsx
// Displays the ticket classification output: category as a label,
// urgency as a color-coded badge, and the reasoning text.

import React from 'react';

// Maps urgency levels to their visual badge class names
const URGENCY_CLASSES = {
  Low: 'urgency-low',
  Medium: 'urgency-medium',
  High: 'urgency-high'
};

export default function ClassificationResult({ classification }) {
  if (!classification) return null;

  const { category, urgency, reasoning } = classification;
  const urgencyClass = URGENCY_CLASSES[urgency] || 'urgency-low';

  return (
    <div className="result-card classification-card fade-in">
      <div className="result-card-header">
        <h3>Classification Result</h3>
      </div>
      <div className="classification-body">
        <div className="classification-badges">
          <div className="badge-group">
            <span className="badge-label">Category</span>
            <span className="category-badge">{category}</span>
          </div>
          <div className="badge-group">
            <span className="badge-label">Urgency</span>
            <span className={`urgency-badge ${urgencyClass}`}>{urgency}</span>
          </div>
        </div>
        <div className="reasoning-section">
          <span className="reasoning-label">Reasoning</span>
          <p className="reasoning-text">{reasoning}</p>
        </div>
      </div>
    </div>
  );
}
