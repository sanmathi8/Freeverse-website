import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, CheckCircle2, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { hireApi } from '../api/hireApi';
import { loadLocalHireRequests, saveLocalHireRequest, updateLocalHireRequestStatus, type LocalHireRequest } from '../utils/storage';

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetFreelancerId?: string;
  targetFreelancerName?: string;
}

export const HireModal: React.FC<HireModalProps> = ({
  isOpen,
  onClose,
  targetFreelancerId,
  targetFreelancerName,
}) => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'dashboard'>('create');
  
  // Hire Request Form State
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('$500 - $1,000');
  const [timeline, setTimeline] = useState('2 Weeks');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Sent & Received Dashboard State
  const [requests, setRequests] = useState<LocalHireRequest[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const reqs = loadLocalHireRequests();
    setRequests(reqs);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !description) return;

    setSubmitting(true);
    setSuccessMsg(false);

    const requesterId = (user as any)?.id || profile?.id || 'client-1';
    const requesterName = profile?.name || user?.username || 'Client User';
    const freelancerId = targetFreelancerId || 'freelancer-1';
    const freelancerName = targetFreelancerName || 'Target Freelancer';

    // Local storage update
    const newReq = saveLocalHireRequest({
      requesterId,
      requesterName,
      freelancerId,
      freelancerName,
      projectTitle,
      description,
      budget,
      timeline,
    });

    setRequests((prev) => [newReq, ...prev]);

    try {
      await hireApi.createHireRequest(freelancerId, projectTitle, description, budget);
    } catch {
      // Graceful local fallback
    } finally {
      setSubmitting(false);
      setSuccessMsg(true);
      setProjectTitle('');
      setDescription('');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: LocalHireRequest['status']) => {
    updateLocalHireRequestStatus(id, newStatus);
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    try {
      if (newStatus === 'ACCEPTED') await hireApi.acceptRequest(id);
      if (newStatus === 'DECLINED') await hireApi.declineRequest(id);
    } catch {
      // Graceful local fallback
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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-400 text-white p-2 shadow-md">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Hire {targetFreelancerName || 'Freelancer'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Send a project offer or manage active hire proposals</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="mt-4 flex gap-2 border-b border-slate-200/30 dark:border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('create')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'create'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Send New Hire Offer
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Hire Proposals Dashboard ({requests.length})
            </button>
          </div>

          {/* Tab 1: Create Proposal */}
          {activeTab === 'create' && (
            <form onSubmit={handleSubmitProposal} className="mt-5 space-y-4">
              {successMsg && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/40 p-3 text-xs text-emerald-400">
                  <CheckCircle2 size={16} />
                  <span>Hire request successfully submitted to {targetFreelancerName || 'freelancer'}!</span>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Project Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Modern E-Commerce Web App Development"
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Project Scope & Deliverables</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project requirements, goals, technologies, and deliverables..."
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Estimated Budget</label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. $500 - $1,000"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Timeline / Urgency</label>
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="e.g. 2 Weeks"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg hover:scale-[1.01] transition-all"
              >
                <Send size={15} />
                <span>{submitting ? 'Submitting Hire Request...' : 'SEND FORMAL HIRE PROPOSAL'}</span>
              </button>
            </form>
          )}

          {/* Tab 2: Hire Proposals Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="mt-4 max-h-[380px] overflow-y-auto space-y-3">
              {requests.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No hire requests sent or received yet.
                </div>
              ) : (
                requests.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-white">{r.projectTitle}</h4>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                          r.status === 'ACCEPTED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : r.status === 'DECLINED'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{r.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <div>
                        Client: <span className="text-white font-bold">{r.requesterName}</span> • Budget: <span className="text-sky-400 font-bold">{r.budget}</span>
                      </div>

                      {r.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(r.id, 'ACCEPTED')}
                            className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-600"
                          >
                            <ThumbsUp size={12} />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(r.id, 'DECLINED')}
                            className="flex items-center gap-1 rounded-lg bg-rose-500 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-rose-600"
                          >
                            <ThumbsDown size={12} />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
