import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Eye, EyeOff, Lock, Mail, User, AtSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/ToastNotification';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Username format check
    const cleanUsername = username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
      setErrorMessage(
        'Username must be between 3 and 30 characters and contain only letters, numbers, or underscores.'
      );
      return;
    }

    // Password length
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // Confirmation match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const data = await register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        username: cleanUsername,
      });

      // If user requires email confirmation
      if (data?.user && !data.session) {
        setRegisteredSuccess(true);
        success('Registration successful! Please check your email to verify your account.');
      } else {
        // Immediate login
        success('Account created successfully! Welcome to AGchat.');
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Registration error:', err);
      const msg =
        err.message ||
        'Registration failed. This email or username may already be in use.';
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setLoading(false);
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
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <div
          className="card"
          style={{
            padding: '36px 32px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
              Join AGchat
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
              Connect with friends, share moments, and explore.
            </p>
          </div>

          {registeredSuccess ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: 'var(--success)',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                Check Your Email
              </h3>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: '24px',
                }}
              >
                We've sent a verification link to <strong>{email}</strong>. Once confirmed, you can log in to your AGchat account.
              </p>
              <Link
                to="/login"
                state={{ message: 'Email confirmed? You may now log in.' }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
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

              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="register-fullname">
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="register-fullname"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Alex Rivera"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                      required
                      style={{ paddingLeft: '40px' }}
                    />
                    <User
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

                {/* Username */}
                <div className="form-group">
                  <label className="form-label" htmlFor="register-username">
                    Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="register-username"
                      type="text"
                      className="form-input"
                      placeholder="alex_rivera"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      disabled={loading}
                      required
                      maxLength={30}
                      style={{ paddingLeft: '40px' }}
                    />
                    <AtSign
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

                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label" htmlFor="register-email">
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="register-email"
                      type="email"
                      className="form-input"
                      placeholder="alex@example.com"
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

                {/* Password */}
                <div className="form-group">
                  <label className="form-label" htmlFor="register-password">
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Minimum 6 characters"
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
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-group" style={{ marginBottom: '22px' }}>
                  <label className="form-label" htmlFor="register-confirm-password">
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="register-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                      style={{ paddingLeft: '40px' }}
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
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

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

              <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  Log in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
