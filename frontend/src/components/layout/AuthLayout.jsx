import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavigation from './MobileNavigation';
import CreatePostModal from '../posts/CreatePostModal';

export const AuthLayout = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setIsCreatePostOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <div className="app-layout">
        {/* Desktop Sidebar */}
        <Sidebar onOpenCreatePost={() => setIsCreatePostOpen(true)} />

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Header />
          <main className="main-content">
            <Outlet context={{ refreshTrigger, openCreatePost: () => setIsCreatePostOpen(true) }} />
          </main>
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation onOpenCreatePost={() => setIsCreatePostOpen(true)} />

        {/* Global Create Post Modal */}
        {isCreatePostOpen && (
          <CreatePostModal
            isOpen={isCreatePostOpen}
            onClose={() => setIsCreatePostOpen(false)}
            onSuccess={handlePostCreated}
          />
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          aside {
            display: none !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .mobile-bottom-nav {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-header {
            display: none !important;
          }
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
