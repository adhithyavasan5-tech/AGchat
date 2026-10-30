import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Settings,
  Grid,
  Heart,
  MessageCircle,
  UserPlus,
  UserCheck,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { profileService } from '../services/profileService';
import { postService } from '../services/postService';
import { socialService } from '../services/socialService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/ToastNotification';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import EditProfileModal from '../components/profile/EditProfileModal';
import FollowersModal from '../components/profile/FollowersModal';
import FollowingModal from '../components/profile/FollowingModal';
import PostCard from '../components/posts/PostCard';

export const Profile = () => {
  const { username: routeUsername } = useParams();
  const navigate = useNavigate();
  const { user, profile: myProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [targetProfile, setTargetProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followActionLoading, setFollowActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [activePostModal, setActivePostModal] = useState(null);

  const isMe =
    myProfile &&
    (myProfile.username === routeUsername || (user && user.id === targetProfile?.id));

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Fetch Profile by username
      const profileData = await profileService.getPublicProfile(routeUsername, true);

      if (!profileData) {
        setError(`No profile found for @${routeUsername}`);
        setLoading(false);
        return;
      }

      setTargetProfile(profileData);

      // Step 2: Fetch follower & following counts
      try {
        const countsRes = await socialService.getFollowCounts(profileData.id);
        setCounts(countsRes);
      } catch (cErr) {
        console.warn('Counts load error:', cErr);
      }

      // Step 3: If viewing another user, check if logged-in user is following them
      if (user && user.id !== profileData.id) {
        try {
          const myFollowing = await socialService.getFollowing(user.id);
          const found = (myFollowing?.results || []).some((u) => u.id === profileData.id);
          setIsFollowing(found);
        } catch (fErr) {
          console.warn('Follow state check error:', fErr);
        }
      }

      // Step 4: Fetch user posts
      try {
        const postsRes = await postService.getUserPosts(profileData.id);
        setPosts(postsRes?.results || []);
      } catch (pErr) {
        console.warn('User posts fetch error:', pErr);
      }
    } catch (err) {
      console.error('Error loading profile page:', err);
      setError('Failed to load profile. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  }, [routeUsername, user]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleFollowToggle = async () => {
    if (!targetProfile || followActionLoading) return;

    setFollowActionLoading(true);
    const previousState = isFollowing;
    const nextState = !previousState;

    setIsFollowing(nextState);
    setCounts((prev) => ({
      ...prev,
      followers: nextState ? prev.followers + 1 : Math.max(0, prev.followers - 1),
    }));

    try {
      if (nextState) {
        const res = await socialService.followUser(targetProfile.id);
        if (typeof res.follower_count === 'number') {
          setCounts((prev) => ({ ...prev, followers: res.follower_count }));
        }
        success(`Now following @${targetProfile.username}`);
      } else {
        const res = await socialService.unfollowUser(targetProfile.id);
        if (typeof res.follower_count === 'number') {
          setCounts((prev) => ({ ...prev, followers: res.follower_count }));
        }
        success(`Unfollowed @${targetProfile.username}`);
      }
    } catch (err) {
      console.error(err);
      setIsFollowing(previousState);
      toastError('Could not update follow status.');
    } finally {
      setFollowActionLoading(false);
    }
  };

  const handleProfileUpdated = (newProfile) => {
    setTargetProfile(newProfile);
    if (newProfile.username !== routeUsername) {
      navigate(`/profile/${newProfile.username}`, { replace: true });
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading profile..." />;
  }

  if (error || !targetProfile) {
    return (
      <div style={{ maxWidth: '600px', width: '100%', margin: '40px auto' }}>
        <EmptyState
          icon={AlertCircle}
          title="Profile Not Found"
          description={error || "The profile you are looking for does not exist."}
          actionText="Back to Home Feed"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', width: '100%', margin: '0 auto' }}>
      {/* Profile Header Card */}
      <div
        className="card"
        style={{
          padding: '32px 24px',
          marginBottom: '28px',
          backgroundColor: 'var(--card-bg)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={targetProfile.avatar_url}
              alt={targetProfile.full_name || targetProfile.username}
              size="xl"
              className="profile-main-avatar"
            />
          </div>

          {/* Info & Stats */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            {/* Username & Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}
            >
              <h2
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                {targetProfile.username}
              </h2>

              {isMe ? (
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="btn btn-secondary"
                  style={{ padding: '7px 16px', fontSize: '0.85rem' }}
                >
                  <Settings size={15} /> Edit Profile
                </button>
              ) : (
                user && (
                  <button
                    onClick={handleFollowToggle}
                    disabled={followActionLoading}
                    className={isFollowing ? 'btn btn-secondary' : 'btn btn-primary'}
                    style={{ padding: '7px 18px', fontSize: '0.85rem' }}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={16} /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} /> Follow
                      </>
                    )}
                  </button>
                )
              )}
            </div>

            {/* Counts Row */}
            <div
              style={{
                display: 'flex',
                gap: '28px',
                marginBottom: '16px',
                fontSize: '0.95rem',
              }}
            >
              <div>
                <strong>{posts.length}</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>posts</span>
              </div>
              <div
                onClick={() => setIsFollowersOpen(true)}
                style={{ cursor: 'pointer' }}
                title="View followers"
              >
                <strong>{counts.followers}</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>followers</span>
              </div>
              <div
                onClick={() => setIsFollowingOpen(true)}
                style={{ cursor: 'pointer' }}
                title="View following"
              >
                <strong>{counts.following}</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>following</span>
              </div>
            </div>

            {/* Full Name & Bio */}
            <div>
              {targetProfile.full_name && (
                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                  {targetProfile.full_name}
                </div>
              )}
              {targetProfile.bio && (
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'pre-wrap',
                    marginTop: '4px',
                    lineHeight: 1.5,
                  }}
                >
                  {targetProfile.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 0',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '20px',
            color: 'var(--primary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <Grid size={18} />
          <span>Posts</span>
        </div>

        {posts.length === 0 ? (
          <EmptyState
            icon={Camera}
            title="No Posts Yet"
            description={
              isMe
                ? "You haven't shared any posts yet. Start by creating your first post!"
                : `@${targetProfile.username} has not posted anything yet.`
            }
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActivePostModal(post)}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  backgroundColor: '#000000',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                className="profile-grid-item"
              >
                <img
                  src={post.image_url}
                  alt={post.caption || 'User post'}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform var(--transition-normal)',
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Followers Modal */}
      {isFollowersOpen && (
        <FollowersModal
          isOpen={isFollowersOpen}
          onClose={() => setIsFollowersOpen(false)}
          userId={targetProfile.id}
          username={targetProfile.username}
          onFollowChange={() => {
            socialService.getFollowCounts(targetProfile.id).then(setCounts);
          }}
        />
      )}

      {/* Following Modal */}
      {isFollowingOpen && (
        <FollowingModal
          isOpen={isFollowingOpen}
          onClose={() => setIsFollowingOpen(false)}
          userId={targetProfile.id}
          username={targetProfile.username}
          onFollowChange={() => {
            socialService.getFollowCounts(targetProfile.id).then(setCounts);
          }}
        />
      )}

      {/* Single Post Inspection Modal */}
      {activePostModal && (
        <div
          className="modal-overlay"
          onClick={() => setActivePostModal(null)}
          style={{ padding: '20px' }}
        >
          <div
            style={{ maxWidth: '580px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <PostCard
              post={activePostModal}
              onDeleteSuccess={(deletedId) => {
                setPosts((prev) => prev.filter((p) => p.id !== deletedId));
                setActivePostModal(null);
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        .profile-grid-item:hover img {
          transform: scale(1.04);
        }
        @media (max-width: 600px) {
          .profile-main-avatar {
            width: 74px !important;
            height: 74px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
