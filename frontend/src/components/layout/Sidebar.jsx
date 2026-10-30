import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  PlusSquare,
  User,
  LogOut,
  Moon,
  Sun,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import { useToast } from '../common/ToastNotification';

export const Sidebar = ({ onOpenCreatePost }) => {
  const { user, profile, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const { info } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      info('You have been logged out.');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const username = profile?.username || user?.user_metadata?.username || 'me';

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      {/* Top Branding & Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Brand */}
        <NavLink to="/" className="brand-logo" style={{ padding: '0 8px' }}>
          <div className="brand-icon">
            <img src="/Logos.jpeg" alt="AGchat Logo" className="brand-logo-img" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          </div>
          <div>
            <div className="brand-text">AGchat</div>
            <div className="brand-tagline">Connect. Share. Discover.</div>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
              transition: 'all var(--transition-fast)',
            })}
          >
            <Home size={22} />
            <span style={{ fontSize: '0.98rem' }}>Home</span>
          </NavLink>

          <NavLink
            to="/explore"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
              transition: 'all var(--transition-fast)',
            })}
          >
            <Compass size={22} />
            <span style={{ fontSize: '0.98rem' }}>Explore</span>
          </NavLink>

          <button
            onClick={onOpenCreatePost}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              width: '100%',
              textAlign: 'left',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <PlusSquare size={22} />
            <span style={{ fontSize: '0.98rem' }}>Create Post</span>
          </button>

          <NavLink
            to={`/profile/${username}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
              transition: 'all var(--transition-fast)',
            })}
          >
            <User size={22} />
            <span style={{ fontSize: '0.98rem' }}>Profile</span>
          </NavLink>
        </nav>
      </div>

      {/* Bottom Profile, Theme Toggle & Logout */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        {/* User Mini Profile */}
        <div
          onClick={() => navigate(`/profile/${username}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Avatar
            src={profile?.avatar_url}
            alt={profile?.full_name || profile?.username || 'You'}
            size="sm"
          />
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {profile?.full_name || profile?.username || 'AGchat User'}
            </div>
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              @{profile?.username || 'user'}
            </div>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger)',
            fontSize: '0.9rem',
          }}
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
