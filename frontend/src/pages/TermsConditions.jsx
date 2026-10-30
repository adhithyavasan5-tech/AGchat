import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export const TermsConditions = () => {
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
            <FileText size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Terms and Conditions
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
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or using AGchat, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access or use the service.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            2. Account Eligibility and Responsibilities
          </h2>
          <p>
            You must be at least 13 years of age to create an AGchat account. You are responsible for safeguarding your login credentials and for any activity under your account. You agree to notify us immediately of any unauthorized use or security breach.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            3. User-Generated Content
          </h2>
          <p>
            You retain ownership of the photos, captions, and comments you upload to AGchat. By posting content, you grant AGchat a non-exclusive license to display, host, and distribute your content solely for the purpose of operating the social platform.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            4. Prohibited Conduct
          </h2>
          <p>When using AGchat, you agree NOT to:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
            <li>Upload unlawful, harmful, defamatory, or abusive content.</li>
            <li>Post spam, automated requests, or unsolicited commercial messages.</li>
            <li>Impersonate any person or entity or misrepresent your affiliation.</li>
            <li>Attempt to bypass API authorization, reverse-engineer, or disrupt platform infrastructure.</li>
            <li>Upload malware, viruses, or malicious files.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            5. Content Moderation and Termination
          </h2>
          <p>
            We reserve the right to review, remove, or disable access to any content that violates these Terms and Conditions. Accounts that repeatedly violate our rules may be suspended or terminated without prior notice.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            6. Service Availability and Limitation of Liability
          </h2>
          <p>
            AGchat is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for high reliability and availability, we do not warrant that the service will be completely uninterrupted or error-free. To the maximum extent permitted by law, AGchat is not liable for indirect, incidental, or consequential damages resulting from your use of the platform.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            7. Changes to Terms
          </h2>
          <p>
            We may update these terms from time to time. Continued use of AGchat after changes become effective constitutes your acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
