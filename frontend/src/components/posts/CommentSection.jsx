import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Send, AlertCircle } from 'lucide-react';
import { socialService } from '../../services/socialService';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastNotification';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';

export const CommentSection = ({ postId, onCommentCountChange }) => {
  const { user, profile: myProfile } = useAuth();
  const { success, error } = useToast();

  const [comments, setComments] = useState([]);
  const [commentAuthors, setCommentAuthors] = useState({});
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await socialService.getComments(postId);
      const items = res?.results || [];
      setComments(items);
      if (onCommentCountChange) {
        onCommentCountChange(res.count ?? items.length);
      }

      // Batch resolve author profiles for comments
      const userIds = [...new Set(items.map((c) => c.user_id))];
      const authorsMap = {};
      await Promise.all(
        userIds.map(async (uid) => {
          try {
            const author = await profileService.getPublicProfile(uid);
            if (author) authorsMap[uid] = author;
          } catch (e) {
            console.warn('Could not resolve author profile:', uid, e);
          }
        })
      );
      setCommentAuthors(authorsMap);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId, onCommentCountChange]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    setIsSubmitting(true);
    try {
      const created = await socialService.addComment(postId, content);
      setNewComment('');

      // Add to state immediately
      setComments((prev) => [...prev, created]);
      if (myProfile) {
        setCommentAuthors((prev) => ({ ...prev, [created.user_id]: myProfile }));
      }
      if (onCommentCountChange) {
        onCommentCountChange(comments.length + 1);
      }
      success('Comment added!');
    } catch (err) {
      console.error('Error adding comment:', err);
      const msg = err.response?.data?.content?.[0] || 'Unable to post comment.';
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setDeletingId(commentId);
    try {
      await socialService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      if (onCommentCountChange) {
        onCommentCountChange(Math.max(0, comments.length - 1));
      }
      success('Comment deleted.');
    } catch (err) {
      console.error('Error deleting comment:', err);
      error('Could not delete comment.');
    } finally {
      setDeletingId(null);
    }
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

      if (diffSec < 60) return 'just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHour < 24) return `${diffHour}h ago`;
      if (diffDay < 7) return `${diffDay}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div
      style={{
        borderTop: '1px solid var(--border-color)',
        padding: '16px',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      {/* Comments List */}
      <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <LoadingSpinner size="sm" text="Loading comments..." />
        ) : comments.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => {
            const author = commentAuthors[comment.user_id];
            const isMine = user && user.id === comment.user_id;

            return (
              <div
                key={comment.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '0.88rem',
                }}
              >
                <Avatar
                  src={author?.avatar_url}
                  alt={author?.username || 'User'}
                  size="xs"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginRight: '6px' }}>
                      {author?.username || 'user'}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {comment.content}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {formatTimestamp(comment.created_at)}
                  </div>
                </div>

                {isMine && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={deletingId === comment.id}
                    title="Delete comment"
                    style={{
                      color: 'var(--text-muted)',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: deletingId === comment.id ? 0.4 : 1,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isSubmitting}
          maxLength={500}
          style={{ padding: '8px 12px', fontSize: '0.88rem' }}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="btn btn-primary"
          style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)' }}
        >
          {isSubmitting ? (
            <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderColor: '#ffffff', borderTopColor: 'transparent' }} />
          ) : (
            <Send size={15} />
          )}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
