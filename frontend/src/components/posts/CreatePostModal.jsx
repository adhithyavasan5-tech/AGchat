import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { postService } from '../../services/postService';
import { useToast } from '../common/ToastNotification';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

export const CreatePostModal = ({ isOpen, onClose, onSuccess }) => {
  const { profile, user } = useAuth();
  const { success, error } = useToast();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WEBP, etc.).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be under 5MB.');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please select an image to share.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setUploadProgress(10);

    try {
      // Step 1: Upload image to Django which uploads to Supabase Storage
      const uploadRes = await postService.uploadPostImage(selectedFile, (progress) => {
        setUploadProgress(Math.min(90, Math.max(10, progress)));
      });

      const imageUrl = uploadRes.image_url;
      if (!imageUrl) {
        throw new Error('Upload succeeded but no image URL was returned.');
      }

      setUploadProgress(95);

      // Step 2: Create post with image_url and caption
      await postService.createPost({
        image_url: imageUrl,
        caption: caption.trim(),
      });

      setUploadProgress(100);
      success('Post created successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error creating post:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        'Failed to upload and create post. Please try again.';
      setErrorMessage(msg);
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '580px', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
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
            Create New Post
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            style={{ color: 'var(--text-muted)', display: 'flex', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {errorMessage && (
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
              <span>{errorMessage}</span>
            </div>
          )}

          {/* User Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Avatar
              src={profile?.avatar_url}
              alt={profile?.full_name || profile?.username || 'You'}
              size="sm"
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {profile?.full_name || profile?.username || 'You'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                @{profile?.username || 'user'}
              </div>
            </div>
          </div>

          {/* Image Upload Dropzone or Preview */}
          {!previewUrl ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragging ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
              >
                <UploadCloud size={28} />
              </div>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Click to upload or drag and drop
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  PNG, JPG, JPEG or WEBP (up to 5MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
            </div>
          ) : (
            <div style={{ position: 'relative', marginBottom: '16px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', maxHeight: '340px', backgroundColor: '#000' }}>
              <img
                src={previewUrl}
                alt="Upload preview"
                style={{
                  width: '100%',
                  maxHeight: '340px',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }}
                disabled={isSubmitting}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Caption Input */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" htmlFor="post-caption">
              Caption
            </label>
            <textarea
              id="post-caption"
              className="form-input"
              rows={3}
              placeholder="Write an engaging caption... #AGchat"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={isSubmitting}
              maxLength={2200}
              style={{ resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {caption.length} / 2200
            </div>
          </div>

          {/* Progress Bar */}
          {isSubmitting && (
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: 'var(--border-color)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${uploadProgress}%`,
                    background: 'var(--brand-gradient)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  textAlign: 'right',
                  marginTop: '4px',
                }}
              >
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedFile}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderColor: '#ffffff', borderTopColor: 'transparent' }} />
                  <span>Sharing...</span>
                </>
              ) : (
                'Share Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
