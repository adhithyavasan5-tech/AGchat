import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusSquare, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

export const MobileNavigation = ({ onOpenCreatePost }) => {
  const { user, profile } = useAuth();
  const username = profile?.username || user?.user_metadata?.username || 'me';

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--card-bg)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 500,
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      }}
      className="mobile-bottom-nav"
    >
      <NavLink
        to="/"
        end
        style={({ isActive }) => ({
          color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px',
        })}
      >
        <Home size={24} />
      </NavLink>

      <NavLink
        to="/explore"
        style={({ isActive }) => ({
          color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px',
        })}
      >
        <Compass size={24} />
      </NavLink>

      <button
        onClick={onOpenCreatePost}
        style={{
          background: 'var(--brand-gradient)',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px var(--primary-glow)',
        }}
        aria-label="Create post"
      >
        <PlusSquare size={22} />
      </button>

      <NavLink
        to={`/profile/${username}`}
        style={({ isActive }) => ({
          color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px',
        })}
      >
        <Avatar
          src={profile?.avatar_url}
          alt={profile?.username || 'Profile'}
          size="xs"
        />
      </NavLink>
    </nav>
  );
};

export default MobileNavigation;
