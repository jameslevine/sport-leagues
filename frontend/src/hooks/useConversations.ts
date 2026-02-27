import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAppStore } from '../store';

const CONVERSATIONS_KEY = 'conversations';

interface Conversation {
  conversationId: string;
  leagueId?: string;
  type: string;
  participants: string[];
  name?: string;
  lastMessageAt: string;
  createdAt: string;
}

interface ChatMessage {
  messageId: string;
  conversationId: string;
  userId: string;
  content: string;
  type: string;
  createdAt: string;
  sender?: {
    userId: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

interface ConversationDetail {
  conversation: Conversation;
  messages: ChatMessage[];
  lastEvaluatedKey?: Record<string, unknown>;
}

export const useConversations = (options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [CONVERSATIONS_KEY, sport],
    queryFn: async () => {
      const res = await apiClient.get<{
        conversations: Conversation[];
        lastEvaluatedKey?: Record<string, unknown>;
      }>(`/${sport}/conversations`);
      return res.conversations ?? [];
    },
    ...options,
  });
};

export const useConversationMessages = (
  conversationId: string,
  options = {},
) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [CONVERSATIONS_KEY, sport, conversationId],
    queryFn: async () => {
      return apiClient.get<ConversationDetail>(
        `/${sport}/conversations/${conversationId}`,
      );
    },
    enabled: !!conversationId,
    ...options,
  });
};

export const useSendMessage = (conversationId: string) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string; type?: string }) => {
      return apiClient.post<ChatMessage>(
        `/${sport}/conversations/${conversationId}`,
        data,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [CONVERSATIONS_KEY, sport, conversationId],
      });
    },
  });
};

export const useCreateConversation = () => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      participants: string[];
      type: string;
      name?: string;
      leagueId?: string;
    }) => {
      return apiClient.post<Conversation>(`/${sport}/conversations`, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] });
    },
  });
};
