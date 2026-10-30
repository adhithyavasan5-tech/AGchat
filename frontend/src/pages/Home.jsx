import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Feed from '../components/posts/Feed';
import RightSidebar from '../components/social/RightSidebar';

export const Home = () => {
  const { refreshTrigger, openCreatePost } = useOutletContext() || {};

  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: '32px' }}>
      {/* Center Feed Column */}
      <div className="feed-column">
        <Feed
          refreshTrigger={refreshTrigger}
          onOpenCreatePost={openCreatePost}
        />
      </div>

      {/* Right Sidebar for Desktop */}
      <RightSidebar />
    </div>
  );
};

export default Home;
