import api from './api';

const profileCache = new Map();
const pendingRequests = new Map();

export const profileService = {
  // Get authenticated user's profile
  async getMyProfile() {
    const response = await api.get('/accounts/me/');
    if (response.data?.id) {
      profileCache.set(response.data.id, response.data);
      if (response.data.username) {
        profileCache.set(response.data.username.toLowerCase(), response.data);
      }
    }
    return response.data;
  },

  // Update authenticated profile (username, full_name, bio)
  async updateMyProfile(profileData) {
    const payload = {};
    if (profileData.username !== undefined) payload.username = profileData.username;
    if (profileData.full_name !== undefined) payload.full_name = profileData.full_name;
    if (profileData.bio !== undefined) payload.bio = profileData.bio;

    const response = await api.patch('/accounts/me/', payload);
    if (response.data?.id) {
      profileCache.set(response.data.id, response.data);
      if (response.data.username) {
        profileCache.set(response.data.username.toLowerCase(), response.data);
      }
    }
    return response.data;
  },

  // Upload avatar image (multipart/form-data with field name 'image')
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/accounts/me/avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Retrieve public profile by username or UUID
  async getPublicProfile(usernameOrId, forceFresh = false) {
    if (!usernameOrId) return null;
    const key = String(usernameOrId).toLowerCase();

    if (!forceFresh && profileCache.has(key)) {
      return profileCache.get(key);
    }

    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }

    const requestPromise = api
      .get(`/accounts/profiles/${encodeURIComponent(usernameOrId)}/`)
      .then((res) => {
        const data = res.data;
        if (data?.id) {
          profileCache.set(data.id, data);
          profileCache.set(data.id.toLowerCase(), data);
          if (data.username) {
            profileCache.set(data.username.toLowerCase(), data);
          }
        }
        return data;
      })
      .catch((err) => {
        // Return null if not found
        if (err.response?.status === 404) return null;
        throw err;
      })
      .finally(() => {
        pendingRequests.delete(key);
      });

    pendingRequests.set(key, requestPromise);
    return requestPromise;
  },

  // Cache helper for batch resolvers
  setCachedProfile(profile) {
    if (profile?.id) {
      profileCache.set(profile.id, profile);
      profileCache.set(profile.id.toLowerCase(), profile);
      if (profile.username) {
        profileCache.set(profile.username.toLowerCase(), profile);
      }
    }
  },

  getCachedProfile(key) {
    if (!key) return null;
    return profileCache.get(String(key).toLowerCase()) || null;
  },
};
