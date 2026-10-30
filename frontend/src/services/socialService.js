import api from './api';

export const socialService = {
  // Like a post
  async likePost(postId) {
    const response = await api.post(`/social/posts/${postId}/like/`);
    return response.data; // { liked: true, created: bool, like_count: N }
  },

  // Unlike a post
  async unlikePost(postId) {
    const response = await api.delete(`/social/posts/${postId}/like/`);
    return response.data; // { liked: false, deleted: bool, like_count: N }
  },

  // Follow a user
  async followUser(userId) {
    const response = await api.post(`/social/users/${userId}/follow/`);
    return response.data; // { following: true, created: bool, follower_count: N }
  },

  // Unfollow a user
  async unfollowUser(userId) {
    const response = await api.delete(`/social/users/${userId}/follow/`);
    return response.data; // { following: false, deleted: bool, follower_count: N }
  },

  // Retrieve user followers
  async getFollowers(userId) {
    const response = await api.get(`/social/users/${userId}/followers/`);
    return response.data; // { count: N, results: [...] }
  },

  // Retrieve user following
  async getFollowing(userId) {
    const response = await api.get(`/social/users/${userId}/following/`);
    return response.data; // { count: N, results: [...] }
  },

  // Retrieve follower & following counts
  async getFollowCounts(userId) {
    const response = await api.get(`/social/users/${userId}/counts/`);
    return response.data; // { followers: N, following: N }
  },

  // Retrieve post comments
  async getComments(postId) {
    const response = await api.get(`/comments/posts/${postId}/`);
    return response.data; // Paginated: { count, next, previous, results: [...] }
  },

  // Add a comment to a post
  async addComment(postId, content) {
    const response = await api.post(`/comments/posts/${postId}/`, {
      content: content.trim(),
    });
    return response.data;
  },

  // Delete own comment
  async deleteComment(commentId) {
    const response = await api.delete(`/comments/${commentId}/`);
    return response.data;
  },
};
