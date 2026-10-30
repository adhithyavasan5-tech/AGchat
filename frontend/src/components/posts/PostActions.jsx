import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { socialService } from '../../services/socialService';
import { useToast } from '../common/ToastNotification';

export const PostActions = ({
  postId,
  initialLiked = false,
  initialLikeCount = 0,
  commentCount = 0,
  onToggleComments,
  isCommentsOpen = false,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiking, setIsLiking] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const { success, error } = useToast();

  const handleLikeToggle = async () => {
    if (isLiking) return;

    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic UI update
    const nextLiked = !previousLiked;
    setIsLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    if (nextLiked) setHeartAnim(true);

    setIsLiking(true);
    try {
      if (nextLiked) {
        const res = await socialService.likePost(postId);
        if (typeof res.like_count === 'number') {
          setLikeCount(res.like_count);
        }
      } else {
        const res = await socialService.unlikePost(postId);
        if (typeof res.like_count === 'number') {
          setLikeCount(res.like_count);
        }
      }
    } catch (err) {
      console.error('Like action failed:', err);
      // Rollback optimistic state
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      error('Could not update like. Please try again.');
    } finally {
      setIsLiking(false);
      setTimeout(() => setHeartAnim(false), 350);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/#post-${postId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(postUrl);
      success('Post link copied to clipboard!');
    }
  };

  return (
    <div style={{ padding: '12px 16px 8px 16px' }}>
      {/* Action Icons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className={`btn-ghost ${heartAnim ? 'heart-animated' : ''}`}
            style={{
              padding: '6px',
              color: isLiked ? 'var(--danger)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              size={24}
              fill={isLiked ? 'var(--danger)' : 'none'}
              strokeWidth={isLiked ? 0 : 2}
            />
          </button>

          {/* Comment Button */}
          <button
            onClick={onToggleComments}
            className="btn-ghost"
            style={{
              padding: '6px',
              color: isCommentsOpen ? 'var(--primary)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Comments"
          >
            <MessageCircle size={24} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="btn-ghost"
            style={{ padding: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
            aria-label="Share post"
          >
            <Share2 size={22} />
          </button>
        </div>
      </div>

      {/* Counts Summary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.88rem', fontWeight: 600 }}>
        <span>
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </span>
        {commentCount > 0 && (
          <span
            onClick={onToggleComments}
            style={{ color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
          >
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </span>
        )}
      </div>
    </div>
  );
};

export default PostActions;
