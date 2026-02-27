import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store';
import { wsClient } from '../services/websocket';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook to manage WebSocket connection lifecycle.
 * Connects when user is authenticated, disconnects on logout.
 * Auto-invalidates conversation queries when new messages arrive.
 */
export const useWebSocketConnection = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      wsClient.connect(user.userId);

      // Listen for incoming messages and invalidate relevant queries
      const unsubscribe = wsClient.on('message', (data) => {
        if (data.conversationId) {
          queryClient.invalidateQueries({
            queryKey: ['conversations'],
          });
        }
      });

      return () => {
        unsubscribe();
        wsClient.disconnect();
      };
    }
  }, [isAuthenticated, user?.userId, queryClient]);

  return {
    isConnected: wsClient.isConnected,
    sendMessage: wsClient.sendMessage.bind(wsClient),
  };
};

/**
 * Hook to subscribe to messages for a specific conversation.
 * Useful in the conversation detail view for real-time updates.
 */
export const useConversationWebSocket = (
  conversationId: string | null,
  onMessage?: (data: any) => void,
) => {
  const callbackRef = useRef(onMessage);
  callbackRef.current = onMessage;

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = wsClient.on(
      `conversation:${conversationId}`,
      (data) => {
        callbackRef.current?.(data);
      },
    );

    return unsubscribe;
  }, [conversationId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (conversationId) {
        wsClient.sendMessage(conversationId, content);
      }
    },
    [conversationId],
  );

  return { sendMessage, isConnected: wsClient.isConnected };
};
