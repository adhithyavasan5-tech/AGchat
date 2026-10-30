import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, UserPlus, UserCheck, Users } from 'lucide-react';
import { socialService } from '../../services/socialService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastNotification';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';

export const FollowingModal = ({ isOpen, onClose, userId, username, onFollowChange }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (!isOpen || !userId) return;

    let mounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        const res = await socialService.getFollowing(userId);
        if (!mounted) return;
        setFollowingList(res?.results || []);

        if (user) {
          const myFollowing = await socialService.getFollowing(user.id);
          const map = {};
          (myFollowing?.results || []).forEach((u) => {
            map[u.id] = true;
          });
          if (mounted) setFollowingMap(map);
        }
      } catch (err) {
        console.error('Error fetching following:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [isOpen, userId, user]);

  if (!isOpen) return null;

  const handleToggleFollow = async (targetUser) => {
    const targetId = targetUser.id;
    const isCurrentlyFollowing = Boolean(followingMap[targetId]);

    setActionLoading((prev) => ({ ...prev, [targetId]: true }));
    try {
      if (isCurrentlyFollowing) {
        await socialService.unfollowUser(targetId);
        setFollowingMap((prev) => ({ ...prev, [targetId]: false }));
        success(`Unfollowed @${targetUser.username}`);
      } else {
        await socialService.followUser(targetId);
        setFollowingMap((prev) => ({ ...prev, [targetId]: true }));
        success(`Now following @${targetUser.username}`);
      }
      if (onFollowChange) onFollowChange();
    } catch (err) {
      console.error(err);
      error('Could not complete follow action.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [targetId]: false }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
            Following
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content List */}
        <div style={{ padding: '12px 16px', maxHeight: '400px', overflowY: 'auto' }}>
          {loading ? (
            <LoadingSpinner text="Loading following..." />
          ) : followingList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-muted)' }}>
              <Users size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
              <p style={{ fontWeight: 600 }}>Not following anyone yet</p>
              <p style={{ fontSize: '0.85rem' }}>Profiles @{username} follows will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {followingList.map((fUser) => {
                const isMe = user && user.id === fUser.id;
                const isFollowing = Boolean(followingMap[fUser.id]);
                const isLoading = Boolean(actionLoading[fUser.id]);

                return (
                  <div
                    key={fUser.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <Link
                      to={`/profile/${fUser.username}`}
                      onClick={onClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        overflow: 'hidden',
                        flex: 1,
                      }}
                    >
                      <Avatar
                        src={fUser.avatar_url}
                        alt={fUser.full_name || fUser.username}
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
                          {fUser.username}
                        </div>
                        {fUser.full_name && (
                          <div
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--text-muted)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {fUser.full_name}
                          </div>
                        )}
                      </div>
                    </Link>

                    {!isMe && user && (
                      <button
                        onClick={() => handleToggleFollow(fUser)}
                        disabled={isLoading}
                        className={isFollowing ? 'btn btn-secondary' : 'btn btn-primary'}
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.82rem',
                          borderRadius: 'var(--radius-md)',
                          minWidth: '96px',
                        }}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck size={14} /> Following
                          </>
                        ) : (
                          <>
                            <UserPlus size={14} /> Follow
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingModal;
