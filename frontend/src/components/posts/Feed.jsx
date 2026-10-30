import React, { useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { postService } from '../../services/postService';
import PostCard from './PostCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';

export const Feed = ({ refreshTrigger, onOpenCreatePost }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFeed = useCallback(async (targetPage = 1, append = false) => {
    try {
      if (targetPage === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      const data = await postService.getFeed(targetPage);
      const results = data?.results || [];

      setPosts((prev) => (append ? [...prev, ...results] : results));
      setHasNext(Boolean(data?.next));
      setPage(targetPage);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError('Unable to load feed posts. Please verify backend connection.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(1, false);
  }, [fetchFeed, refreshTrigger]);

  const handleDeleteSuccess = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasNext) {
      fetchFeed(page + 1, true);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 0' }}>
        <LoadingSpinner text="Loading your AGchat feed..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => fetchFeed(1, false)}
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Camera}
        title="Welcome to AGchat!"
        description="Your feed is currently empty. Start sharing your memories or follow other users to see their posts."
        actionText="Create First Post"
        onAction={onOpenCreatePost}
      />
    );
  }

  return (
    <div className="feed-container" style={{ width: '100%' }}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDeleteSuccess={handleDeleteSuccess}
        />
      ))}

      {hasNext && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 40px 0' }}>
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="btn btn-secondary"
            style={{ minWidth: '160px' }}
          >
            {loadingMore ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <>
                <RefreshCw size={16} /> Load More Posts
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;
