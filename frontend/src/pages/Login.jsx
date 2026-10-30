import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useToast } from '../components/common/ToastNotification';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  const registeredMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await login({ email: email.trim(), password });
      success('Welcome back to AGchat!');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.message ||
        'Invalid email or password. Please check your credentials and try again.';
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setForgotLoading(true);
    try {
      await authService.resetPassword(forgotEmail.trim());
      setForgotSuccess('Password reset link sent! Please check your inbox.');
      success('Password reset email sent.');
    } catch (err) {
      toastError(err.message || 'Unable to send reset email.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div style={{ maxWidth: '420px', width: '100%' }}>
        {/* Brand Card */}
        <div
          className="card"
          style={{
            padding: '36px 32px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          {/* Header Branding */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              className="brand-icon"
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                margin: '0 auto 16px auto',
                boxShadow: '0 8px 24px var(--primary-glow)',
              }}
            >
              <img src="/Logos.jpeg" alt="AGchat Logo" className="brand-logo-img" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            </div>
            <h1
              className="brand-text"
              style={{ fontSize: '2rem', letterSpacing: '-0.03em', marginBottom: '4px' }}
            >
              AGchat
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
              Connect. Share. Discover.
            </p>
          </div>

          {registeredMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                fontSize: '0.85rem',
                marginBottom: '20px',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{registeredMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                fontSize: '0.85rem',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  style={{ paddingLeft: '40px' }}
                />
                <Mail
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
            </div>

            {/* Password Field */}
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--primary)',
                    fontWeight: 600,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                />
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px', padding: '12px' }}
            >
              {loading ? (
                <>
                  <div
                    className="spinner"
                    style={{
                      width: '16px',
                      height: '16px',
                      borderWidth: '2px',
                      borderColor: '#ffffff',
                      borderTopColor: 'transparent',
                    }}
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '24px 0',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            <span style={{ padding: '0 12px' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>

          {/* Registration Link */}
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{ color: 'var(--primary)', fontWeight: 700 }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '420px', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
              Reset Password
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Enter your registered email address and we will send you a link to reset your password.
            </p>

            {forgotSuccess ? (
              <div
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success)',
                  fontSize: '0.88rem',
                  marginBottom: '16px',
                }}
              >
                {forgotSuccess}
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail.trim()}
                    className="btn btn-primary"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
