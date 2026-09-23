import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Mail, Lock, User, AtSign, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(authModalMode || 'login');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Sync mode when modal opens
  React.useEffect(() => {
    if (authModalMode) setMode(authModalMode);
    setError(null);
    setSuccessMsg(null);
  }, [authModalMode, authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login({
          usernameOrEmail: formData.email || formData.username,
          password: formData.password,
        });
        if (!res.success) setError(res.message);
      } else if (mode === 'register') {
        const res = await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
        });
        if (!res.success) setError(res.message);
      } else if (mode === 'forgot') {
        const res = await authApi.forgotPassword(formData.email);
        if (res.success) {
          setSuccessMsg('Password reset instructions sent to your email.');
        } else {
          setError(res.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLoginMock = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Simulate Google OAuth response for dev testing
      const googleUser = {
        email: 'student.google@freeverse.dev',
        googleId: 'google-oauth-12345',
        name: 'Google Student Creator',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&q=80',
      };
      const res = await authApi.googleLogin(googleUser);
      if (res.success) {
        window.location.reload();
      } else {
        setError(res.message || 'Google OAuth failed');
      }
    } catch (err: any) {
      setError('Google OAuth service configuration required');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
        onClick={closeAuthModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-strong relative w-full max-w-md overflow-hidden rounded-3xl border border-sky-300/50 dark:border-sky-500/40 p-6 sm:p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-300 mb-3">
              <Sparkles size={14} className="text-sky-400 animate-pulse" />
              <span>FREEVERSE AUTHENTICATION</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Join Freeverse Student Ecosystem'}
              {mode === 'forgot' && 'Reset Password'}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {mode === 'login' && 'Log in to manage your freelancer profile and projects'}
              {mode === 'register' && 'Create your account to showcase skills and connect'}
              {mode === 'forgot' && 'Enter your email to receive a password reset link'}
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-rose-500/10 p-3.5 text-xs font-bold text-rose-500 border border-rose-500/20">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-500 border border-emerald-500/20">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Sanmathi"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {(mode === 'register' || mode === 'login' || mode === 'forgot') && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {mode === 'login' ? 'Email Address or Username *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={mode === 'login' ? 'text' : 'email'}
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={mode === 'login' ? 'sanmathi or sanmathi@example.com' : 'sanmathi@example.com'}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Username *</label>
                <div className="relative">
                  <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="sanmathi"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {(mode === 'login' || mode === 'register') && (
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password *</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-extrabold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50 mt-2"
            >
              <span>
                {submitting
                  ? 'Processing...'
                  : mode === 'login'
                  ? 'Sign In'
                  : mode === 'register'
                  ? 'Create Freeverse Account'
                  : 'Send Reset Link'}
              </span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Social Google Login Button */}
          {mode !== 'forgot' && (
            <div className="mt-5 border-t border-slate-200/80 dark:border-slate-800/80 pt-4 text-center">
              <p className="mb-3 text-[11px] text-slate-500 uppercase font-bold tracking-wider">Or continue with</p>
              <button
                type="button"
                onClick={handleGoogleLoginMock}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 py-2.5 px-4 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Toggle Login / Register */}
          <div className="mt-5 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="font-extrabold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Join Freeverse
                </button>
              </p>
            )}
            {mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-extrabold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-extrabold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
