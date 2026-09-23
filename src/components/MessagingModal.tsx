import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, Search, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messageApi } from '../api/messageApi';
import { loadLocalMessages, saveLocalMessage } from '../utils/storage';
import { demoFreelancers } from '../data/freelancers';

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId?: string;
  targetUserName?: string;
}

export const MessagingModal: React.FC<MessagingModalProps> = ({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
}) => {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activePartner, setActivePartner] = useState<{ id: string; name: string; avatar?: string } | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Load initial conversations / local messages
    const fetchConvs = async () => {
      try {
        const res = await messageApi.getConversations();
        if (res.success && res.data && res.data.length > 0) {
          setConversations(res.data);
          if (targetUserId) {
            const found = res.data.find((c: any) => c.otherUser?.id === targetUserId);
            if (found) {
              setActivePartner({
                id: targetUserId,
                name: targetUserName || found.otherUser?.username || 'Freelancer',
                avatar: found.otherUser?.avatar,
              });
            } else {
              setActivePartner({
                id: targetUserId,
                name: targetUserName || 'Freelancer',
              });
            }
          } else {
            setActivePartner({
              id: res.data[0].otherUser?.id || 'demo-1',
              name: res.data[0].otherUser?.username || 'Freelancer Partner',
              avatar: res.data[0].otherUser?.avatar,
            });
          }
        } else {
          // Local fallback conversations
          const localMsgs = loadLocalMessages();
          const demoPartner = targetUserId
            ? { id: targetUserId, name: targetUserName || 'Freelancer' }
            : { id: demoFreelancers[0].id, name: demoFreelancers[0].name, avatar: demoFreelancers[0].avatar };

          setActivePartner(demoPartner);
          setConversations([
            {
              id: 'local-conv-1',
              otherUser: demoPartner,
              lastMessage: localMsgs.length > 0 ? localMsgs[localMsgs.length - 1] : { content: 'Hey, let\'s collaborate!' },
            },
          ]);
        }
      } catch {
        const demoPartner = targetUserId
          ? { id: targetUserId, name: targetUserName || 'Freelancer' }
          : { id: demoFreelancers[0].id, name: demoFreelancers[0].name, avatar: demoFreelancers[0].avatar };
        setActivePartner(demoPartner);
        setConversations([
          {
            id: 'local-conv-1',
            otherUser: demoPartner,
            lastMessage: { content: 'Interested in working together!' },
          },
        ]);
      }
    };

    fetchConvs();
  }, [isOpen, targetUserId, targetUserName]);

  useEffect(() => {
    if (!activePartner || !isOpen) return;

    const syncMessages = () => {
      const localMsgs = loadLocalMessages();
      const currentUserId = (user as any)?.id || profile?.id || 'current-user';

      const filtered = localMsgs.filter(
        (m) =>
          (m.senderId === currentUserId && m.recipientId === activePartner.id) ||
          (m.senderId === activePartner.id && m.recipientId === currentUserId)
      );

      if (filtered.length === 0) {
        setMessages([
          {
            id: 'welcome-1',
            senderId: activePartner.id,
            senderName: activePartner.name,
            content: `Hi there! I am ${activePartner.name}. Feel free to message me regarding freelance opportunities or project collaborations!`,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
      } else {
        setMessages(filtered);
      }
    };

    syncMessages();
    const interval = setInterval(syncMessages, 1500);
    return () => clearInterval(interval);
  }, [activePartner, isOpen, user, profile]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !activePartner) return;

    const content = inputContent.trim();
    setInputContent('');
    setSending(true);

    const currentUserId = (user as any)?.id || profile?.id || 'current-user';
    const currentUserName = profile?.name || user?.username || 'You';

    // Local state optimistic update
    const newMsg = {
      id: 'msg-' + Date.now(),
      senderId: currentUserId,
      recipientId: activePartner.id,
      senderName: currentUserName,
      content: content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    saveLocalMessage({
      senderId: currentUserId,
      recipientId: activePartner.id,
      senderName: currentUserName,
      content: content,
    });

    try {
      await messageApi.sendMessage(activePartner.id, content);
    } catch (e) {
      console.warn('Backend offline, message saved to local storage:', e);
    } finally {
      setSending(false);
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
          className="glass-strong relative flex h-[580px] w-full max-w-4xl overflow-hidden rounded-3xl border border-sky-300/40 dark:border-sky-500/30 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar Conversations List */}
          <div className="w-full md:w-1/3 border-r border-slate-200/40 dark:border-slate-800/80 bg-slate-900/40 p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-sky-400" />
                <h3 className="font-extrabold text-sm text-white">Direct Messages</h3>
              </div>
            </div>

            <div className="mt-3 relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="mt-3 flex-1 overflow-y-auto space-y-1">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActivePartner({
                      id: c.otherUser?.id || 'demo-1',
                      name: c.otherUser?.username || c.otherUser?.name || 'Freelancer',
                      avatar: c.otherUser?.avatar,
                    });
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all text-left ${
                    activePartner?.id === c.otherUser?.id
                      ? 'bg-sky-500/20 border border-sky-400/40 text-white'
                      : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <img
                    src={c.otherUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}
                    alt={c.otherUser?.name}
                    className="h-9 w-9 rounded-full object-cover border border-sky-400/50 shrink-0"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate text-white">{c.otherUser?.name || c.otherUser?.username || 'Freelancer'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{c.lastMessage?.content || 'Click to message'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-950/60">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              {activePartner ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activePartner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}
                      alt={activePartner.name}
                      className="h-10 w-10 rounded-full object-cover border border-sky-400/60"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{activePartner.name}</h4>
                    <p className="text-[10px] text-emerald-400">Online — Available for messages</p>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-bold text-slate-400">Select a conversation</div>
              )}

              <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Chat Thread Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const isMe = m.senderId === ((user as any)?.id || profile?.id || 'current-user');
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-md ${
                        isMe
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed">{m.content}</p>
                      <div className={`mt-1 flex items-center gap-1 text-[9px] ${isMe ? 'text-sky-100 justify-end' : 'text-slate-400'}`}>
                        <span>{new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && <CheckCheck size={11} className="text-sky-200" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="border-t border-slate-800 p-3 flex items-center gap-2">
              <input
                type="text"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder={`Type a reply message to ${activePartner?.name || 'freelancer'}...`}
                className="flex-1 rounded-xl bg-slate-900 border border-slate-700/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputContent.trim() || sending}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 text-white hover:scale-105 disabled:opacity-50 transition-all shadow-md"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
