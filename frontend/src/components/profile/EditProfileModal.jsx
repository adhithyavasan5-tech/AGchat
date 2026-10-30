import React, { useState, useRef } from 'react';
import { X, Camera, AlertCircle } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastNotification';
import Avatar from '../common/Avatar';

export const EditProfileModal = ({ isOpen, onClose, onProfileUpdated }) => {
  const { profile, updateProfileState } = useAuth();
  const { success, error } = useToast();

  const [username, setUsername] = useState(profile?.username || '');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleAvatarChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file.');
      return;
    }
    setFormError('');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setFormError('Username cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      let updatedAvatarUrl = profile?.avatar_url;

      // Step 1: Upload avatar if changed
      if (avatarFile) {
        const uploadRes = await profileService.uploadAvatar(avatarFile);
        updatedAvatarUrl = uploadRes.avatar_url;
      }

      // Step 2: Update text profile fields
      const updatedProfile = await profileService.updateMyProfile({
        username: username.trim(),
        full_name: fullName.trim(),
        bio: bio.trim(),
      });

      if (updatedAvatarUrl) {
        updatedProfile.avatar_url = updatedAvatarUrl;
      }

      updateProfileState(updatedProfile);
      success('Profile updated successfully!');
      if (onProfileUpdated) onProfileUpdated(updatedProfile);
      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);
      const msg =
        err.response?.data?.username?.[0] ||
        err.response?.data?.message ||
        'Unable to update profile. Please try another username.';
      setFormError(msg);
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            Edit Profile
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{ color: 'var(--text-muted)', display: 'flex' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 20px' }}>
          {formError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                fontSize: '0.85rem',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          {/* Avatar Edit Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar
                src={avatarPreview}
                alt={fullName || username}
                size="xl"
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)',
                  border: '2px solid var(--card-bg)',
                }}
              >
                <Camera size={16} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-ghost"
              style={{ color: 'var(--primary)', fontSize: '0.85rem', padding: '4px 10px' }}
            >
              Change Profile Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleAvatarChange(e.target.files?.[0])}
            />
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-username">
              Username
            </label>
            <input
              id="edit-username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              maxLength={30}
              required
            />
          </div>

          {/* Full Name Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-fullname">
              Full Name
            </label>
            <input
              id="edit-fullname"
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isSubmitting}
              maxLength={100}
            />
          </div>

          {/* Bio Field */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="edit-bio">
              Bio
            </label>
            <textarea
              id="edit-bio"
              className="form-input"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isSubmitting}
              maxLength={200}
              placeholder="Tell the AGchat community about yourself..."
              style={{ resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {bio.length} / 200
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
