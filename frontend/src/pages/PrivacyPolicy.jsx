import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 20px 80px 20px', width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            color: 'var(--primary)',
            fontWeight: 600,
            marginBottom: '16px',
          }}
        >
          <ArrowLeft size={16} /> Back to AGchat
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
            <Shield size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Last updated: October 30, 2026
            </p>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: '32px',
          backgroundColor: 'var(--card-bg)',
          lineHeight: 1.7,
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            1. Introduction
          </h2>
          <p>
            AGchat ("we", "our", or "us") provides a social platform where individuals can connect, share posts, and interact with other users. This Privacy Policy details our practices concerning the collection, use, and disclosure of information when you use our service.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            2. Information We Collect
          </h2>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>
              <strong>Account Information:</strong> When you register for an account, we collect your email address, full name, and username.
            </li>
            <li>
              <strong>Profile Information:</strong> You may choose to provide a bio and upload a profile picture (avatar).
            </li>
            <li>
              <strong>User-Generated Content:</strong> We store posts (including uploaded images and captions), comments, and social reactions (likes and follow relationships).
            </li>
            <li>
              <strong>Authentication & Session Data:</strong> Secure authentication tokens managed through Supabase Auth to keep you signed in across sessions.
            </li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            3. How We Use Your Information
          </h2>
          <p>We use the collected information for the following purposes:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
            <li>To provide, operate, and maintain your AGchat profile and feed.</li>
            <li>To process your image uploads and publish your posts.</li>
            <li>To manage your social relationships (following, followers, likes, and comments).</li>
            <li>To authenticate your identity and protect against unauthorized access.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            4. Media Storage and Third-Party Infrastructure
          </h2>
          <p>
            AGchat utilizes Supabase for database storage (PostgreSQL) and media storage (Supabase Storage). Uploaded images are stored in protected storage buckets and served over HTTPS. We do not sell your personal data or user-generated media to third-party data brokers.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            5. Data Retention and Account Deletion
          </h2>
          <p>
            We retain your personal information as long as your account is active. You may edit your username, full name, bio, and avatar at any time via your profile settings. You can delete your own posts and comments at any time, which immediately removes them from public display.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            6. Your Rights and Contact Information
          </h2>
          <p>
            You have the right to access, rectify, or request deletion of your personal data. For privacy questions or account-related inquiries, please reach out to the AGchat administrative team through your registered account contact channel.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
