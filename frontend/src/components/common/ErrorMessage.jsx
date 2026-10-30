import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry, title = 'Something went wrong' }) => {
  return (
    <div
      style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--danger-light)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        textAlign: 'center',
        margin: '16px 0',
      }}
    >
      <AlertCircle
        size={36}
        color="var(--danger)"
        style={{ margin: '0 auto 12px auto' }}
      />
      <h4 style={{ color: 'var(--danger)', marginBottom: '6px', fontWeight: 600 }}>
        {title}
      </h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: onRetry ? '16px' : '0' }}>
        {message || 'Unable to load content. Please check your connection and try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem', padding: '8px 16px', margin: '0 auto' }}
        >
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
