import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('agchat_theme') || 'light';
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('agchat_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Fetch or refresh Django profile
  const refreshProfile = useCallback(async () => {
    try {
      const data = await profileService.getMyProfile();
      setProfile(data);
      return data;
    } catch (err) {
      console.warn('Could not fetch Django profile:', err);
      return null;
    }
  }, []);

  const updateProfileState = useCallback((newFields) => {
    setProfile((prev) => {
      if (!prev) return newFields;
      return { ...prev, ...newFields };
    });
  }, []);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          try {
            const myProfile = await profileService.getMyProfile();
            if (mounted) setProfile(myProfile);
          } catch (e) {
            console.warn('Initial profile load deferred:', e);
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Error during initial auth setup:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          try {
            const myProfile = await profileService.getMyProfile();
            if (mounted) setProfile(myProfile);
          } catch (err) {
            console.warn('Profile fetch after auth event failed:', err);
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    setUser(result.user);
    setSession(result.session);
    if (result.profile) {
      setProfile(result.profile);
    } else {
      await refreshProfile();
    }
    return result;
  };

  const register = async (credentials) => {
    const result = await authService.register(credentials);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    theme,
    toggleTheme,
    login,
    register,
    logout,
    refreshProfile,
    updateProfileState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
