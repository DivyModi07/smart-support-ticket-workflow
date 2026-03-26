// ReplyCard.jsx
// Displays the AI-generated customer reply in a styled card.
// Shows a word count warning badge if the reply is outside the 80-120 word range.
// Includes a copy-to-clipboard button with a brief confirmation message.

import React, { useState } from 'react';

export default function ReplyCard({ reply }) {
  const [copied, setCopied] = useState(false);

  if (!reply) return null;

  const { text, wordCount, isOutOfRange } = reply;

  // Determines the appropriate warning message for out-of-range replies
  const getWarningMessage = () => {
    if (wordCount < 80) return 'Reply too short \u2014 review before sending';
    if (wordCount > 120) return 'Reply too long \u2014 review before sending';
    return '';
  };

  // Copies reply text to clipboard and shows brief confirmation
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers or non-HTTPS
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="result-card reply-card fade-in">
      <div className="result-card-header">
        <h3>Generated Reply</h3>
        <span className="word-count">{wordCount} words</span>
      </div>

      {isOutOfRange && (
        <div className="reply-warning">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L1 14h14L8 1z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M8 6v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {getWarningMessage()}
        </div>
      )}

      <div className="reply-body">
        <p className="reply-text">{text}</p>
      </div>

      <div className="reply-actions">
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          type="button"
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 11V3a1 1 0 011-1h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Copy Reply
            </>
          )}
        </button>
      </div>
    </div>
  );
}
