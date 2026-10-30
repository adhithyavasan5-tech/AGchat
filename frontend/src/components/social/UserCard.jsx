import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, UserCheck } from 'lucide-react';
import { socialService } from '../../services/socialService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastNotification';
import Avatar from '../common/Avatar';

export const UserCard = ({ user: targetUser, isInitiallyFollowing = false, onFollowToggle }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
  const [loading, setLoading] = useState(false);

  const isMe = user && user.id === targetUser.id;

  const handleFollowToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    const nextState = !isFollowing;
    try {
      if (nextState) {
        await socialService.followUser(targetUser.id);
        setIsFollowing(true);
        success(`Following @${targetUser.username}`);
      } else {
        await socialService.unfollowUser(targetUser.id);
        setIsFollowing(false);
        success(`Unfollowed @${targetUser.username}`);
      }
      if (onFollowToggle) onFollowToggle(targetUser.id, nextState);
    } catch (err) {
      console.error(err);
      error('Could not complete follow action.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        transition: 'all var(--transition-fast)',
        gap: '12px',
      }}
    >
      <Link
        to={`/profile/${targetUser.username}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        <Avatar
          src={targetUser.avatar_url}
          alt={targetUser.full_name || targetUser.username}
          size="sm"
        />
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {targetUser.username}
          </div>
          {targetUser.full_name && (
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {targetUser.full_name}
            </div>
          )}
        </div>
      </Link>

      {!isMe && user && (
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={isFollowing ? 'btn btn-secondary' : 'btn btn-primary'}
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            borderRadius: 'var(--radius-md)',
            minWidth: '94px',
          }}
        >
          {isFollowing ? (
            <>
              <UserCheck size={13} /> Following
            </>
          ) : (
            <>
              <UserPlus size={13} /> Follow
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default UserCard;
