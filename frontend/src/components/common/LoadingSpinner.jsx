import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = '', fullPage = false }) => {
  const sizeMap = {
    sm: { width: '18px', height: '18px', borderWidth: '2px' },
    md: { width: '28px', height: '28px', borderWidth: '3px' },
    lg: { width: '42px', height: '42px', borderWidth: '4px' },
  };

  const style = sizeMap[size] || sizeMap.md;

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: fullPage ? '60px 20px' : '20px',
      }}
    >
      <div className="spinner" style={style} />
      {text && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
