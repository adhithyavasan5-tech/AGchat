import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageCircle, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastNotification';

export const Header = () => {
  const { theme, toggleTheme, logout } = useAuth();
  const navigate = useNavigate();
  const { info } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      info('You have been logged out.');
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header
      style={{
        display: 'none',
        height: '56px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--card-bg)',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 400,
      }}
      className="mobile-header"
    >
      <NavLink to="/" className="brand-logo" style={{ fontSize: '1.2rem' }}>
        <img src="/Logos.jpeg" alt="AGchat Logo" className="brand-logo-img" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
        <div className="brand-text">AGchat</div>
      </NavLink>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={toggleTheme}
          className="btn btn-ghost"
          style={{ padding: '8px' }}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{ padding: '8px', color: 'var(--danger)' }}
          aria-label="Log out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
