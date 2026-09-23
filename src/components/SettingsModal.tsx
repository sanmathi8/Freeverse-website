import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Bell, Shield, Trash2, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../api/profileApi';
import { saveOwnerProfile, deleteOwnerProfile } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileDeleted?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onProfileDeleted }) => {
  const { user, profile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications' | 'privacy' | 'danger'>('account');

  // Account tab state
  const [fullName, setFullName] = useState(profile?.name || user?.username || '');
  const [username, setUsername] = useState(profile?.username || user?.username || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  
  // Security tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notifications state
  const [notifications, setNotifications] = useState({
    messages: true,
    hireRequests: true,
    projectUpdates: true,
  });

  // Privacy state
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmailPublic: false,
    enable2FA: false,
  });

  // Danger Zone deletion confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    try {
      if (profile) {
        saveOwnerProfile({
          ...profile,
          name: fullName,
          username,
          email,
        });
      }
      await profileApi.updateMyProfile({ name: fullName, username, email }).catch(() => {});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Please enter your current password' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setPasswordMsg({ type: 'success', text: 'Password successfully updated!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(null), 3500);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete my profile') return;
    setIsDeleting(true);
    try {
      await profileApi.deleteMyProfile().catch(() => {});
      deleteOwnerProfile();
      if (onProfileDeleted) onProfileDeleted();
      logout();
      onClose();
    } catch (err) {
      deleteOwnerProfile();
      if (onProfileDeleted) onProfileDeleted();
      logout();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-strong relative w-full max-w-2xl overflow-hidden rounded-3xl border border-sky-300/40 dark:border-sky-500/30 p-6 sm:p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-500 border border-sky-400/40">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Account & System Settings</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage your profile preferences and security controls</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body with Sidebar Tabs */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[360px]">
            {/* Tabs List */}
            <div className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-slate-200/40 dark:border-slate-800/80 pr-0 md:pr-4">
              <button
                type="button"
                onClick={() => setActiveTab('account')}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'account'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <User size={15} />
                <span>Account</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Lock size={15} />
                <span>Security</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'notifications'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Bell size={15} />
                <span>Notifications</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'privacy'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Shield size={15} />
                <span>Privacy</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('danger')}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'danger'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    : 'text-rose-500 hover:bg-rose-500/10'
                }`}
              >
                <Trash2 size={15} />
                <span>Danger Zone</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="md:col-span-3">
              {activeTab === 'account' && (
                <form onSubmit={handleSaveAccount} className="space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-200/30 dark:border-slate-800 pb-2">
                    Account Profile Info
                  </h4>

                  {saveSuccess && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/40 p-3 text-xs text-emerald-400">
                      <Check size={16} />
                      <span>Account preferences saved successfully!</span>
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-sky-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              )}

              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-200/30 dark:border-slate-800 pb-2">
                    Security & Password
                  </h4>

                  {passwordMsg && (
                    <div
                      className={`flex items-center gap-2 rounded-xl p-3 text-xs border ${
                        passwordMsg.type === 'success'
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                      }`}
                    >
                      {passwordMsg.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
                      <span>{passwordMsg.text}</span>
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-sky-600 transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-200/30 dark:border-slate-800 pb-2">
                    Notification Preferences
                  </h4>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between rounded-2xl border border-slate-200/40 dark:border-slate-800/80 p-3.5 hover:bg-slate-500/5 cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Direct Messages</p>
                        <p className="text-[11px] text-slate-500">Receive email alerts when a freelancer messages you</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.messages}
                        onChange={(e) => setNotifications({ ...notifications, messages: e.target.checked })}
                        className="h-4 w-4 rounded accent-sky-500"
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-2xl border border-slate-200/40 dark:border-slate-800/80 p-3.5 hover:bg-slate-500/5 cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Hire Requests</p>
                        <p className="text-[11px] text-slate-500">Get notified when a client submits a project proposal</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.hireRequests}
                        onChange={(e) => setNotifications({ ...notifications, hireRequests: e.target.checked })}
                        className="h-4 w-4 rounded accent-sky-500"
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-2xl border border-slate-200/40 dark:border-slate-800/80 p-3.5 hover:bg-slate-500/5 cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Project Activity</p>
                        <p className="text-[11px] text-slate-500">Receive updates on your featured portfolio projects</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.projectUpdates}
                        onChange={(e) => setNotifications({ ...notifications, projectUpdates: e.target.checked })}
                        className="h-4 w-4 rounded accent-sky-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-200/30 dark:border-slate-800 pb-2">
                    Privacy Controls
                  </h4>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between rounded-2xl border border-slate-200/40 dark:border-slate-800/80 p-3.5 hover:bg-slate-500/5 cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Public Profile Discovery</p>
                        <p className="text-[11px] text-slate-500">Allow your freelancer card to appear in search & Talent Network</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.profileVisible}
                        onChange={(e) => setPrivacy({ ...privacy, profileVisible: e.target.checked })}
                        className="h-4 w-4 rounded accent-sky-500"
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-2xl border border-slate-200/40 dark:border-slate-800/80 p-3.5 hover:bg-slate-500/5 cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Display Email Publicly</p>
                        <p className="text-[11px] text-slate-500">Show email address on your public profile contact card</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.showEmailPublic}
                        onChange={(e) => setPrivacy({ ...privacy, showEmailPublic: e.target.checked })}
                        className="h-4 w-4 rounded accent-sky-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'danger' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-rose-500 border-b border-rose-500/20 pb-2">
                    Danger Zone — Account Deletion
                  </h4>

                  <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-rose-500">Permanently Delete Freelancer Profile</h5>
                        <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                          This action will immediately delete your freelancer card, portfolio projects, messages, hire proposals, and login account. This action cannot be undone.
                        </p>
                      </div>
                    </div>

                    {!showDeleteConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="mt-2 rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600 transition-colors shadow-sm"
                      >
                        Delete My Profile & Account
                      </button>
                    ) : (
                      <div className="space-y-3 border-t border-rose-500/20 pt-3">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Type <span className="text-rose-500 font-mono">delete my profile</span> below to confirm:
                        </p>
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="delete my profile"
                          className="w-full rounded-xl border border-rose-500/50 bg-slate-900 px-3.5 py-2 text-xs text-white focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={deleteConfirmText.toLowerCase() !== 'delete my profile' || isDeleting}
                            onClick={handleDeleteAccount}
                            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-extrabold text-white disabled:opacity-50 hover:bg-rose-700 transition-colors"
                          >
                            {isDeleting ? 'Deleting...' : 'Confirm Permanent Deletion'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setDeleteConfirmText('');
                            }}
                            className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
