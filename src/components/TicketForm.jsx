// TicketForm.jsx
// Handles ticket submission with inline validation for all required fields.
// Disables form during workflow processing to prevent duplicate submissions.

import React, { useState, forwardRef, useImperativeHandle } from 'react';

// Validates email format: must contain @ and at least one dot after @
function isValidEmail(email) {
  const atIndex = email.indexOf('@');
  if (atIndex < 1) return false;
  const afterAt = email.slice(atIndex + 1);
  return afterAt.includes('.') && !afterAt.endsWith('.');
}

const TicketForm = forwardRef(function TicketForm({ onSubmit, isProcessing }, ref) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update field value and clear its error on change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Mark field as touched on blur for validation display
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // Validate a single field and update errors state
  const validateField = (field, value) => {
    let error = '';
    const trimmed = value.trim();

    switch (field) {
      case 'customerName':
        if (!trimmed) error = 'Customer name is required';
        break;
      case 'customerEmail':
        if (!trimmed) error = 'Email address is required';
        else if (!isValidEmail(trimmed)) error = 'Enter a valid email (must contain @ and .)';
        break;
      case 'subject':
        if (!trimmed) error = 'Subject is required';
        break;
      case 'message':
        if (!trimmed) error = 'Message is required';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  // Validate all fields before submission
  const validateAll = () => {
    const fields = ['customerName', 'customerEmail', 'subject', 'message'];
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        isValid = false;
        newErrors[field] = error;
      }
    });

    // Mark all fields as touched to show all errors
    setTouched({ customerName: true, customerEmail: true, subject: true, message: true });
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    onSubmit({
      customerName: formData.customerName.trim(),
      customerEmail: formData.customerEmail.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim()
    });
  };

  // Reset form to initial state after workflow completes
  const resetForm = () => {
    setFormData({ customerName: '', customerEmail: '', subject: '', message: '' });
    setErrors({});
    setTouched({});
  };

  // Expose resetForm to the parent component via ref
  useImperativeHandle(ref, () => ({ resetForm }));

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h2>Submit a Support Ticket</h2>
        <p className="form-subtitle">Enter the customer details and issue below</p>
      </div>

      <div className="form-grid">
        <div className={`form-group ${touched.customerName && errors.customerName ? 'has-error' : ''}`}>
          <label htmlFor="customerName">Customer Name</label>
          <input
            id="customerName"
            type="text"
            placeholder="John Doe"
            value={formData.customerName}
            onChange={e => handleChange('customerName', e.target.value)}
            onBlur={() => handleBlur('customerName')}
            disabled={isProcessing}
            autoComplete="off"
          />
          {touched.customerName && errors.customerName && (
            <span className="field-error">{errors.customerName}</span>
          )}
        </div>

        <div className={`form-group ${touched.customerEmail && errors.customerEmail ? 'has-error' : ''}`}>
          <label htmlFor="customerEmail">Customer Email</label>
          <input
            id="customerEmail"
            type="email"
            placeholder="john@example.com"
            value={formData.customerEmail}
            onChange={e => handleChange('customerEmail', e.target.value)}
            onBlur={() => handleBlur('customerEmail')}
            disabled={isProcessing}
            autoComplete="off"
          />
          {touched.customerEmail && errors.customerEmail && (
            <span className="field-error">{errors.customerEmail}</span>
          )}
        </div>

        <div className={`form-group full-width ${touched.subject && errors.subject ? 'has-error' : ''}`}>
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            placeholder="Brief description of the issue"
            value={formData.subject}
            onChange={e => handleChange('subject', e.target.value)}
            onBlur={() => handleBlur('subject')}
            disabled={isProcessing}
            autoComplete="off"
          />
          {touched.subject && errors.subject && (
            <span className="field-error">{errors.subject}</span>
          )}
        </div>

        <div className={`form-group full-width ${touched.message && errors.message ? 'has-error' : ''}`}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            rows={5}
            placeholder="Describe the customer's issue in detail..."
            value={formData.message}
            onChange={e => handleChange('message', e.target.value)}
            onBlur={() => handleBlur('message')}
            disabled={isProcessing}
          />
          {touched.message && errors.message && (
            <span className="field-error">{errors.message}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <span className="spinner" />
            Processing Ticket...
          </>
        ) : (
          'Process Ticket'
        )}
      </button>
    </form>
  );
});

export default TicketForm;
