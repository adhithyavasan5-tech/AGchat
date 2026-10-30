import api from './api';

export const postService = {
  // Retrieve paginated feed
  async getFeed(page = 1) {
    const response = await api.get(`/posts/?page=${page}`);
    return response.data;
  },

  // Upload image to Supabase Storage via Django
  async uploadPostImage(file, onProgress) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/posts/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data; // { message, image_url }
  },

  // Create a new post
  async createPost({ image_url, caption }) {
    const response = await api.post('/posts/', {
      image_url,
      caption: caption || '',
    });
    return response.data;
  },

  // Retrieve posts belonging to a specific user
  async getUserPosts(userId, page = 1) {
    const response = await api.get(`/posts/user/${userId}/?page=${page}`);
    return response.data;
  },

  // Retrieve a single post
  async getPost(postId) {
    const response = await api.get(`/posts/${postId}/`);
    return response.data;
  },

  // Update a post caption
  async updatePost(postId, { caption }) {
    const response = await api.patch(`/posts/${postId}/`, { caption });
    return response.data;
  },

  // Delete a post
  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}/`);
    return response.data;
  },
};
