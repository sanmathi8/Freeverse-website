import { fetchApi } from './client';

export interface MessageData {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
}

export interface ConversationData {
  id: string;
  otherUser?: any;
  lastMessage?: MessageData;
  updatedAt: string;
  messages?: MessageData[];
}

export const messageApi = {
  async getConversations() {
    return fetchApi<ConversationData[]>('/conversations');
  },

  async getConversationById(id: string) {
    return fetchApi<ConversationData>(`/conversations/${id}`);
  },

  async sendMessage(recipientUserId: string, content: string) {
    return fetchApi<MessageData>('/conversations/messages', {
      method: 'POST',
      body: JSON.stringify({ recipientUserId, content }),
    });
  },
};
