import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, type UserAuthData } from '../api/authApi';
import { profileApi } from '../api/profileApi';
import { getAuthToken, setAuthToken } from '../api/client';
import { loadOwnerProfile } from '../utils/storage';
import type { Freelancer } from '../data/freelancers';

interface AuthContextType {
  user: UserAuthData | null;
  profile: Freelancer | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot';
  oauthError: string | null;
  login: (data: { usernameOrEmail: string; password: string }) => Promise<{ success: boolean; message: string }>;
  register: (data: { email: string; username: string; password: string; fullName: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuthData | null>(null);
  const [profile, setProfile] = useState<Freelancer | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [oauthError, setOauthError] = useState<string | null>(null);

  const openAuthModal = useCallback((mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await profileApi.getMyProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setUser((prev) => (prev ? { ...prev, profile: res.data } : null));
      }
    } catch (err) {
      console.warn('Failed to load user profile from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Automatic LocalStorage Profile Migration Handler
  const migrateLocalStorageIfNeeded = useCallback(async (backendProfile: Freelancer | null) => {
    try {
      if (backendProfile && (!backendProfile.about || backendProfile.about === 'Welcome to my Freeverse profile!' || backendProfile.about === 'Welcome to my Freeverse freelancer profile!')) {
        const localOwner = loadOwnerProfile();
        if (localOwner && localOwner.about && localOwner.about.length > 5 && !localOwner.about.includes('Welcome to my Freeverse')) {
          const migrationData = {
            fullName: localOwner.name,
            professionalTitle: localOwner.title,
            about: localOwner.about,
            profilePhotoUrl: localOwner.avatar,
            college: localOwner.education,
            skills: localOwner.skills,
            services: localOwner.services,
            githubUrl: localOwner.github,
            linkedinUrl: localOwner.linkedin,
            portfolioUrl: localOwner.portfolio,
            availability: localOwner.availability,
          };
          await profileApi.updateMyProfile(migrationData);
          await refreshProfile();
        }
      }
    } catch (err) {
      console.warn('Localstorage migration skipped/failed:', err);
    }
  }, [refreshProfile]);

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check for Real OAuth2 Callback Token/Error in URL hash
      const combined = (window.location.hash || '') + (window.location.search || '');
      if (combined.includes('oauth2/redirect')) {
        const urlParams = new URLSearchParams(combined.substring(combined.indexOf('?')));
        const tokenParam = urlParams.get('token');
        const errorParam = urlParams.get('error');

        if (tokenParam) {
          setAuthToken(tokenParam);
          setToken(tokenParam);
          const meRes = await authApi.getCurrentUser();
          if (meRes.success && meRes.data) {
            const uData = meRes.data as any;
            setUser({
              userId: uData.id,
              username: uData.username,
              email: uData.email,
              accessToken: tokenParam,
              emailVerified: uData.emailVerified,
            });
            const profRes = await profileApi.getMyProfile();
            if (profRes.success && profRes.data) {
              setProfile(profRes.data);
            }
          }
          window.location.hash = '';
          setIsLoading(false);
          return;
        } else if (errorParam) {
          setOauthError(errorParam);
          window.location.hash = '';
          openAuthModal('login');
        }
      }

      // 2. Standard Token Initialization
      const currentToken = getAuthToken();
      if (currentToken) {
        const meRes = await authApi.getCurrentUser();
        if (meRes.success && meRes.data) {
          const uData = meRes.data as any;
          setUser({
            userId: uData.id,
            username: uData.username,
            email: uData.email,
            accessToken: currentToken,
            emailVerified: uData.emailVerified,
          });
          const profRes = await profileApi.getMyProfile();
          if (profRes.success && profRes.data) {
            setProfile(profRes.data);
            await migrateLocalStorageIfNeeded(profRes.data);
          }
        } else {
          setAuthToken(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [migrateLocalStorageIfNeeded, openAuthModal]);

  const login = async (data: { usernameOrEmail: string; password: string }) => {
    setIsLoading(true);
    const res = await authApi.login(data);
    if (res.success && res.data) {
      setToken(res.data.accessToken);
      setUser(res.data);
      if (res.data.profile) {
        setProfile(res.data.profile);
        await migrateLocalStorageIfNeeded(res.data.profile);
      } else {
        await refreshProfile();
      }
      setIsLoading(false);
      closeAuthModal();
      return { success: true, message: res.message || 'Login successful' };
    }
    setIsLoading(false);
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (data: { email: string; username: string; password: string; fullName: string }) => {
    setIsLoading(true);
    const res = await authApi.register(data);
    if (res.success && res.data) {
      setToken(res.data.accessToken);
      setUser(res.data);
      if (res.data.profile) {
        setProfile(res.data.profile);
      } else {
        await refreshProfile();
      }
      setIsLoading(false);
      return { success: true, message: res.message || 'Registration successful. Please verify your email.' };
    }
    setIsLoading(false);
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    authApi.logout();
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        authModalOpen,
        authModalMode,
        oauthError,
        login,
        register,
        logout,
        refreshProfile,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
