import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Mail, Lock, User, AtSign, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, login, register, oauthError } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'forgot'>(authModalMode || 'login');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    fullName: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Sync mode when modal opens
  React.useEffect(() => {
    if (authModalMode) setMode(authModalMode);
    setError(oauthError || null);
    setSuccessMsg(null);
  }, [authModalMode, authModalOpen, oauthError]);

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
        if (!res.success) {
          setError(res.message);
        }
      } else if (mode === 'register') {
        const res = await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
        });
        if (res.success) {
          setMode('verify');
          setSuccessMsg(`Account created! A 6-digit confirmation code has been sent to ${formData.email}. Please check your email inbox.`);
        } else {
          setError(res.message);
        }
      } else if (mode === 'verify') {
        if (!verificationCode || verificationCode.length < 6) {
          setError('Please enter the 6-digit verification code sent to your email address.');
          setSubmitting(false);
          return;
        }

        const res = await authApi.verifyEmail(verificationCode);
        if (res.success) {
          setSuccessMsg('Email address verified successfully! Logging into your account...');
          setTimeout(async () => {
            const loginRes = await login({
              usernameOrEmail: formData.email || formData.username,
              password: formData.password,
            });
            if (!loginRes.success) {
              setError(loginRes.message);
            }
          }, 1000);
        } else {
          setError(res.message);
        }
      } else if (mode === 'forgot') {
        const res = await authApi.forgotPassword(formData.email);
        if (res.success) {
          setSuccessMsg('Password reset instructions sent to your email.');
        } else {
          setError(res.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during authentication');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData.email) {
      setError('Please enter your registered email address to resend verification code.');
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      const res = await authApi.resendVerificationCode(formData.email);
      if (res.success) {
        setSuccessMsg(`A new 6-digit verification code has been sent to ${formData.email}.`);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    const backendBaseUrl = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '')
      : 'http://localhost:8080';
    window.location.href = `${backendBaseUrl}/oauth2/authorization/google`;
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
              {mode === 'verify' && 'Verify Your Email Address'}
              {mode === 'forgot' && 'Reset Password'}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {mode === 'login' && 'Log in with your username or email to manage your profile'}
              {mode === 'register' && 'Create your account with email & password'}
              {mode === 'verify' && 'Enter the 6-digit verification code sent to your email inbox'}
              {mode === 'forgot' && 'Enter your email to receive a password reset link'}
            </p>
          </div>

          {/* Notifications */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-500">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-400">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Alex Rivera"
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {(mode === 'register' || mode === 'login' || mode === 'verify') && (
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {mode === 'login' ? 'Username or Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type={mode === 'login' ? 'text' : 'email'}
                    required
                    disabled={mode === 'verify'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={mode === 'login' ? 'alex.rivera@gmail.com or alexrivera' : 'alex.rivera@gmail.com'}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none disabled:opacity-70"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="alexrivera"
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {(mode === 'login' || mode === 'register') && (
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {mode === 'verify' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">6-Digit Confirmation Code</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-3 text-sky-400" size={18} />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="w-full font-mono tracking-widest text-center text-base rounded-2xl border border-sky-400/50 bg-white/80 dark:bg-slate-900/80 py-3 text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Didn't receive code?</span>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleResendCode}
                    className="inline-flex items-center gap-1 font-bold text-sky-500 hover:underline disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={submitting ? "animate-spin" : ""} />
                    <span>Resend code</span>
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs font-semibold text-sky-500 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <span>
                {submitting
                  ? 'Processing...'
                  : mode === 'login'
                  ? 'Sign In'
                  : mode === 'register'
                  ? 'Create Profile & Account'
                  : mode === 'verify'
                  ? 'Verify Code & Sign In'
                  : 'Send Reset Link'}
              </span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Social Google Login Divider */}
          {mode !== 'verify' && mode !== 'forgot' && (
            <div className="my-6">
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                <span className="absolute bg-white dark:bg-slate-950 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-3 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Toggle Register / Login */}
          <div className="mt-4 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-sky-500 hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-sky-500 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
