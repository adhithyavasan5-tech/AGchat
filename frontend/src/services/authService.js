import { supabase } from './supabase';
import api from './api';

export const authService = {
  // Sign up with Supabase Email & Password
  async register({ email, password, fullName, username }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
          username: username || '',
        },
      },
    });

    if (error) throw error;

    // If auto-logged in (email verification disabled or session returned immediately)
    if (data.session) {
      try {
        await api.get('/accounts/me/');
        if (fullName || username) {
          await api.patch('/accounts/me/', {
            full_name: fullName,
            username: username,
          });
        }
      } catch (e) {
        console.warn('Initial profile sync deferred:', e);
      }
    }

    return data;
  },

  // Sign in with Supabase
  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Sync profile with Django
    let profile = null;
    try {
      const res = await api.get('/accounts/me/');
      profile = res.data;
    } catch (e) {
      console.warn('Could not immediately sync Django profile:', e);
    }

    return { user: data.user, session: data.session, profile };
  },

  // Sign out
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Password reset request
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
    return data;
  },

  // Retrieve current active session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Retrieve current active user
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
};
