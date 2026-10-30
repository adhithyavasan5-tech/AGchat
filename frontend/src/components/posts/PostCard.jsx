import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Trash2, Edit3, Link2, Heart, MessageSquare } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { postService } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastNotification';
import Avatar from '../common/Avatar';
import PostActions from './PostActions';
import CommentSection from './CommentSection';

export const PostCard = ({ post, onDeleteSuccess }) => {
  const { user, profile: myProfile } = useAuth();
  const { success, error } = useToast();

  const [author, setAuthor] = useState(() =>
    profileService.getCachedProfile(post.user_id)
  );
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption || '');
  const [caption, setCaption] = useState(post.caption || '');
  const [isSaving, setIsSaving] = useState(false);
  const [doubleTapHeart, setDoubleTapHeart] = useState(false);

  const isOwner = user && user.id === post.user_id;

  // Resolve author profile by user_id
  useEffect(() => {
    let active = true;
    if (!author) {
      profileService.getPublicProfile(post.user_id).then((data) => {
        if (active && data) setAuthor(data);
      });
    }
    return () => {
      active = false;
    };
  }, [post.user_id, author]);

  // Double click / tap to like
  const handleDoubleTap = () => {
    setDoubleTapHeart(true);
    setTimeout(() => setDoubleTapHeart(false), 800);
  };

  const handleUpdateCaption = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await postService.updatePost(post.id, { caption: editCaption.trim() });
      setCaption(editCaption.trim());
      setIsEditing(false);
      success('Caption updated.');
    } catch (err) {
      console.error(err);
      error('Failed to update caption.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }

    try {
      await postService.deletePost(post.id);
      success('Post deleted.');
      if (onDeleteSuccess) onDeleteSuccess(post.id);
    } catch (err) {
      console.error(err);
      error('Failed to delete post.');
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#post-${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      success('Post link copied!');
    }
    setShowMenu(false);
  };

  const formatTimestamp = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHour < 24) return `${diffHour}h ago`;
      if (diffDay === 1) return 'Yesterday';
      if (diffDay < 7) return `${diffDay}d ago`;
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const username = author?.username || 'user';
  const fullName = author?.full_name || username;

  return (
    <article
      id={`post-${post.id}`}
      className="card"
      style={{
        position: 'relative',
        marginBottom: '24px',
        backgroundColor: 'var(--card-bg)',
      }}
    >
      {/* Post Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
        }}
      >
        <Link
          to={`/profile/${username}`}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <Avatar
            src={author?.avatar_url}
            alt={fullName}
            size="sm"
          />
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.92rem',
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}
            >
              {username}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {formatTimestamp(post.created_at)}
            </div>
          </div>
        </Link>

        {/* Options Menu Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="btn-ghost"
            style={{ padding: '6px', color: 'var(--text-secondary)' }}
            aria-label="Post options"
          >
            <MoreHorizontal size={20} />
          </button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '150px',
                zIndex: 50,
                overflow: 'hidden',
              }}
            >
              <button
                onClick={handleCopyLink}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Link2 size={15} /> Copy Link
              </button>

              {isOwner && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Edit3 size={15} /> Edit Caption
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleDeletePost();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      color: 'var(--danger)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Trash2 size={15} /> Delete Post
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Image Container with Double Tap Animation */}
      <div
        onDoubleClick={handleDoubleTap}
        style={{
          position: 'relative',
          backgroundColor: '#000000',
          cursor: 'pointer',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={post.image_url}
          alt={caption || 'Post image'}
          loading="lazy"
          style={{
            width: '100%',
            maxHeight: '620px',
            objectFit: 'contain',
            display: 'block',
          }}
        />

        {/* Double tap heart icon overlay */}
        {doubleTapHeart && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              pointerEvents: 'none',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <Heart
              size={90}
              fill="#ffffff"
              color="#ffffff"
              style={{
                filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
                transform: 'scale(1.1)',
                animation: 'heartPulse 0.4s ease-out',
              }}
            />
          </div>
        )}
      </div>

      {/* Post Actions (Likes, Comment toggle, Share) */}
      <PostActions
        postId={post.id}
        commentCount={commentCount}
        onToggleComments={() => setIsCommentsOpen((prev) => !prev)}
        isCommentsOpen={isCommentsOpen}
      />

      {/* Caption & Metadata */}
      <div style={{ padding: '0 16px 14px 16px' }}>
        {isEditing ? (
          <form onSubmit={handleUpdateCaption} style={{ marginTop: '8px' }}>
            <textarea
              className="form-input"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              rows={2}
              style={{ fontSize: '0.88rem', resize: 'none', marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          caption && (
            <div style={{ fontSize: '0.92rem', lineHeight: 1.5, wordBreak: 'break-word' }}>
              <Link
                to={`/profile/${username}`}
                style={{ fontWeight: 700, color: 'var(--text-primary)', marginRight: '6px' }}
              >
                {username}
              </Link>
              <span style={{ color: 'var(--text-secondary)' }}>{caption}</span>
            </div>
          )
        )}
      </div>

      {/* Comments Drawer / Section */}
      {isCommentsOpen && (
        <CommentSection
          postId={post.id}
          onCommentCountChange={(count) => setCommentCount(count)}
        />
      )}
    </article>
  );
};

export default PostCard;
