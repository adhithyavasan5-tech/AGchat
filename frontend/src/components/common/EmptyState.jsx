import React from 'react';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        backgroundColor: 'var(--card-bg)',
        border: '1px dashed var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
      }}
    >
      {Icon && (
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            marginBottom: '16px',
          }}
        >
          <Icon size={30} />
        </div>
      )}
      <h3
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            maxWidth: '380px',
            marginBottom: actionText ? '20px' : '0',
          }}
        >
          {description}
        </p>
      )}
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
