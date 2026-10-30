import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Home, Compass } from 'lucide-react';

export const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px 20px',
        width: '100%',
      }}
    >
      <div
        className="brand-icon"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '20px',
        }}
      >
              <img src="/Logos.jpeg" alt="AGchat Logo" className="brand-logo-img" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
      </div>

      <h1
        style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          marginBottom: '12px',
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '10px',
        }}
      >
        Page Not Found
      </h2>

      <p
        style={{
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          maxWidth: '420px',
          lineHeight: 1.6,
          marginBottom: '28px',
        }}
      >
        The page you are looking for doesn't exist, was removed, or had its URL changed.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary" style={{ padding: '10px 20px' }}>
          <Home size={18} /> Back to Home
        </Link>
        <Link to="/explore" className="btn btn-secondary" style={{ padding: '10px 20px' }}>
          <Compass size={18} /> Explore Community
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
