export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  LEAGUES: '/leagues',
  LEAGUE_DETAIL: '/leagues/:leagueId',
  ROUNDS: '/rounds',
  ROUND_DETAIL: '/rounds/:roundId',
  MATCH_DETAIL: '/matches/:matchId',
  PROFILE: '/profile',
  NOTIFICATION_SETTINGS: '/settings/notifications',
  USER_PROFILE: '/users/:userId',
  MESSAGES: '/messages',
  CONVERSATION: '/messages/:conversationId',
  SETTINGS: '/settings',
} as const;

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const COGNITO_USER_POOL_ID =
  import.meta.env.VITE_COGNITO_USER_POOL_ID || '';
export const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || '';
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
