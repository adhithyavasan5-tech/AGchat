import React, { useState, useEffect } from 'react';
import { Search, Compass, Users, Grid, AlertCircle, Heart } from 'lucide-react';
import { profileService } from '../services/profileService';
import { postService } from '../services/postService';
import { socialService } from '../services/socialService';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/social/UserCard';
import PostCard from '../components/posts/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export const Explore = () => {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [explorePosts, setExplorePosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activePost, setActivePost] = useState(null);
  const [followingMap, setFollowingMap] = useState({});

  // Fetch explore grid posts & suggestions
  useEffect(() => {
    let mounted = true;

    const loadExploreData = async () => {
      try {
        setLoadingPosts(true);

        // Fetch feed posts for explore grid
        const feedData = await postService.getFeed(1);
        if (mounted) setExplorePosts(feedData?.results || []);

        // Load follow map for current user
        let myFollowingIds = [];
        if (user) {
          try {
            const fRes = await socialService.getFollowing(user.id);
            const map = {};
            (fRes?.results || []).forEach((u) => {
              map[u.id] = true;
              myFollowingIds.push(u.id);
            });
            if (mounted) setFollowingMap(map);
          } catch (e) {
            console.warn('Following list load error:', e);
          }
        }

        // Suggestions based on community authors
        const candidateUsernames = ['hht_Adhithya_18', 'myteam54337_72d9d4'];
        const resolved = [];
        for (const un of candidateUsernames) {
          try {
            const p = await profileService.getPublicProfile(un);
            if (p && p.id !== user?.id && !myFollowingIds.includes(p.id)) {
              resolved.push(p);
            }
          } catch (e) {
            // ignore
          }
        }
        if (mounted) setSuggestedUsers(resolved);
      } catch (err) {
        console.error('Explore load error:', err);
      } finally {
        if (mounted) setLoadingPosts(false);
      }
    };

    loadExploreData();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Handle User Search by username (using GET /api/accounts/profiles/{username}/)
  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim().replace(/^@/, '');
    if (!query) return;

    setSearchLoading(true);
    setSearchError('');
    setHasSearched(true);
    setSearchResult(null);

    try {
      const profile = await profileService.getPublicProfile(query, true);
      if (profile) {
        setSearchResult(profile);
      } else {
        setSearchError(`No user found with username "@${query}".`);
      }
    } catch (err) {
      console.error(err);
      setSearchError(`No user found with username "@${query}".`);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', width: '100%', margin: '0 auto' }}>
      {/* Search Bar Header */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          marginBottom: '28px',
          backgroundColor: 'var(--card-bg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Compass size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Explore Community
          </h2>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search people by username (e.g. cichat_test_user)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={searchLoading || !searchQuery.trim()}
            className="btn btn-primary"
            style={{ padding: '0 22px' }}
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            {searchLoading ? (
              <LoadingSpinner size="sm" text="Searching AGchat profiles..." />
            ) : searchResult ? (
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Search Result
                </p>
                <UserCard
                  user={searchResult}
                  isInitiallyFollowing={Boolean(followingMap[searchResult.id])}
                  onFollowToggle={(id, nextState) => {
                    setFollowingMap((prev) => ({ ...prev, [id]: nextState }));
                  }}
                />
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
                {searchError || 'No matching profile found.'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Suggested Profiles Section */}
      {suggestedUsers.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Users size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Suggested Accounts
            </h3>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '12px',
            }}
          >
            {suggestedUsers.map((sUser) => (
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
        </div>
      )}

      {/* Explore Post Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Grid size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Discover Posts
          </h3>
        </div>

        {loadingPosts ? (
          <LoadingSpinner text="Loading explore grid..." />
        ) : explorePosts.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No posts found"
            description="Be the first to share a moment with the AGchat community!"
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}
          >
            {explorePosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActivePost(post)}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  backgroundColor: '#000000',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                className="explore-grid-card"
              >
                <img
                  src={post.image_url}
                  alt={post.caption || 'Explore post'}
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

      {/* Post Modal on Click */}
      {activePost && (
        <div
          className="modal-overlay"
          onClick={() => setActivePost(null)}
          style={{ padding: '20px' }}
        >
          <div
            style={{ maxWidth: '580px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <PostCard
              post={activePost}
              onDeleteSuccess={(deletedId) => {
                setExplorePosts((prev) => prev.filter((p) => p.id !== deletedId));
                setActivePost(null);
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        .explore-grid-card:hover img {
          transform: scale(1.04);
        }
      `}</style>
    </div>
  );
};

export default Explore;
