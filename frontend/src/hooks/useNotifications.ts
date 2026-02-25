import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAppStore } from '../store';

const NOTIFICATIONS_KEY = 'notifications';

interface Notification {
  notificationId: string;
  userId: string;
  type: string;
  channel: string;
  status: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  sentAt?: string;
  createdAt: string;
}

export const useNotifications = (options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [NOTIFICATIONS_KEY, sport],
    queryFn: async () => {
      const response = await apiClient.get<{
        notifications: Notification[];
      }>(`/${sport}/notifications`);
      return response.notifications ?? [];
    },
    ...options,
  });
};

export const useUpdateNotificationPreferences = () => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prefs: {
      push: boolean;
      sms: boolean;
      email: boolean;
      phoneNumber?: string;
    }) => {
      return apiClient.patch(`/${sport}/notifications/preferences`, prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
