import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { socialService } from '../../services/socialService';
import Avatar from '../common/Avatar';
import UserCard from './UserCard';

export const RightSidebar = () => {
  const { user, profile } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSuggestions = async () => {
      try {
        setLoading(true);

        // Fetch who I am already following
        let myFollowing = [];
        if (user) {
          const followingRes = await socialService.getFollowing(user.id);
          myFollowing = followingRes?.results || [];
          const map = {};
          myFollowing.forEach((u) => {
            map[u.id] = true;
          });
          if (active) setFollowingMap(map);
        }

        // Suggest key community users not yet followed by current user
        const candidateUsernames = ['hht_Adhithya_18', 'myteam54337_72d9d4'];
        const resolvedList = [];

        for (const un of candidateUsernames) {
          try {
            const p = await profileService.getPublicProfile(un);
            if (p && p.id !== user?.id && !myFollowing.some((f) => f.id === p.id)) {
              resolvedList.push(p);
            }
          } catch (e) {
            // ignore if not found
          }
        }

        if (active) setSuggestions(resolvedList);
      } catch (err) {
        console.warn('Could not load suggestions:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSuggestions();

    return () => {
      active = false;
    };
  }, [user]);

  const username = profile?.username || 'user';
  const fullName = profile?.full_name || username;

  return (
    <aside className="right-sidebar">
      {/* Logged-in User Profile Summary */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
        }}
      >
        <Link
          to={`/profile/${username}`}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}
        >
          <Avatar
            src={profile?.avatar_url}
            alt={fullName}
            size="md"
          />
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.92rem',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {username}
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {fullName}
            </div>
          </div>
        </Link>

        <Link
          to={`/profile/${username}`}
          className="btn-ghost"
          style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, padding: '4px 8px' }}
        >
          View
        </Link>
      </div>

      {/* Suggested Users Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Suggested For You
            </span>
          </div>
          <Link
            to="/explore"
            style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}
          >
            See All
          </Link>
        </div>

        {suggestions.length === 0 ? (
          <div
            style={{
              padding: '18px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-tertiary)',
              textAlign: 'center',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
            }}
          >
            <Users size={20} style={{ margin: '0 auto 6px auto', opacity: 0.6 }} />
            No new suggestions right now. Explore the community!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {suggestions.map((sUser) => (
              <UserCard
                key={sUser.id}
                user={sUser}
                isInitiallyFollowing={Boolean(followingMap[sUser.id])}
                onFollowToggle={(id, nextState) => {
                  setFollowingMap((prev) => ({ ...prev, [id]: nextState }));
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Branding & Links */}
      <footer style={{ marginTop: 'auto', paddingTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
          AGchat &copy; {new Date().getFullYear()}
        </p>
        <p>Connect. Share. Discover.</p>
          <Link to="/privacy-policy" style={{ color: 'var(--text-muted)' }}>
            Privacy
          </Link>
          <span>&bull;</span>
          <Link to="/terms-and-conditions" style={{ color: 'var(--text-muted)' }}>
            Terms
          </Link>
          <span>&bull;</span>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-muted)' }}
          >
            Infrastructure
          </a>

      </footer>
    </aside>
  );
};

export default RightSidebar;
