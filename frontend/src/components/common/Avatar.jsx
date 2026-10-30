import React, { useState } from 'react';

export const Avatar = ({
  src,
  alt = 'User',
  size = 'md',
  className = '',
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const clean = name.trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const sizeClass = `avatar-${size}`;

  return (
    <div
      className={`avatar ${sizeClass} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title={alt}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <span>{getInitials(alt)}</span>
      )}
    </div>
  );
};

export default Avatar;
