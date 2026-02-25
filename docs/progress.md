# Sport Leagues - Project Progress

## Project Overview

Multi-platform sports league management application (Web + iOS/Android) with real-time messaging, match auto-scheduling, and multi-channel notifications.

**Live URLs:**

- Website: https://d3e8loweracod4.cloudfront.net
- API: https://ebxuv8co28.execute-api.eu-west-1.amazonaws.com/dev
- AWS Region: eu-west-1
- Stack: sport-leagues-dev

---

## Phase 1: Foundation ✅

### Infrastructure

- [x] AWS SAM template (`template.yaml`)
- [x] Cognito User Pool + Client
- [x] 13 DynamoDB tables (PAY_PER_REQUEST)
- [x] API Gateway (REST) + Lambda
- [x] S3 + CloudFront (OAC, HTTPS-only)
- [x] Deployed to AWS (stack: `sport-leagues-dev`)

### Backend (Express + Lambda)

- [x] Project setup (TypeScript, Express, serverless-http)
- [x] DynamoDB client + Stripe client
- [x] Type definitions (Sport, User, League, Round, Match, Score, Conversation, Payment, Follow, Notification)
- [x] Cognito JWT auth middleware
- [x] Joi validation middleware
- [x] Error handler middleware

### Backend - Adapters (DynamoDB CRUD)

- [x] Users adapter
- [x] Leagues adapter (+ League Members)
- [x] Rounds adapter (+ Round Participants)
- [x] Matches adapter
- [x] Scores adapter
- [x] Conversations adapter (+ Chat Messages)
- [x] Follows adapter
- [x] Payments adapter

### Backend - Controllers & Routes

- [x] Leagues controller (CRUD, join/leave, members)
- [x] Rounds controller (CRUD, join with payment, leave with refund, cancel)
- [x] Matches controller (auto-scheduling by handicap, reschedule, CRUD)
- [x] Notification routes (get notifications, update preferences)
- [x] Users controller (get profile, update profile, follow/unfollow)
- [x] Scores controller (submit scores, get scores, verify)
- [x] Conversations controller (list, create, get messages, send message)

### Backend - Libraries

- [x] Notification system (Twilio SMS, AWS SES email, Expo Push)
- [x] WebSocket connection manager (save/remove/broadcast)
- [x] Stripe payment integration
- [ ] WebSocket Lambda handlers (connect, disconnect, sendMessage)

### Frontend Web (React + Vite + MUI)

- [x] Project setup (Vite, TypeScript, MUI theme)
- [x] Zustand store (auth + app state)
- [x] API client with auth token injection
- [x] Router with protected routes
- [x] Main layout (AppBar, Drawer navigation, user menu)
- [x] Login page (mock auth)
- [x] Register page
- [x] Dashboard page (stat cards)
- [x] Leagues page (league cards with categories)
- [x] League detail page (tabs: Rounds, Members, Leaderboard, Chat)
- [x] Round detail page
- [x] Match detail page (players, reschedule dialog, group chat link)
- [x] Messages page
- [x] Profile page
- [x] Notification settings page (push/SMS/email toggles)
- [x] Deployed to S3/CloudFront

### Mobile (Expo + React Native + Paper)

- [x] Project setup (Expo Router, React Native Paper)
- [x] Auth screens (Login, Register)
- [x] Tab navigation (Dashboard, Leagues, Messages, Profile)
- [x] Dashboard screen
- [x] Leagues screen
- [x] Messages screen
- [x] Profile screen
- [x] Match detail screen (with reschedule dialog)
- [x] Notification settings screen
- [ ] Install dependencies and test on device

---

## Phase 2: Core Functionality 🔜

### Authentication (High Priority)

- [x] Implement real Cognito auth in frontend (amazon-cognito-identity-js)
  - [x] Sign up with email verification (2-step: register → verify code)
  - [x] Sign in (SRP auth)
  - [x] Forgot password / Reset password (service layer)
  - [x] Token refresh (automatic via Cognito SDK)
  - [x] Logout
- [x] API client updated to use Cognito access tokens
- [x] Auto-create user record in DynamoDB on first GET /users/me
- [ ] Implement real Cognito auth in mobile (expo-auth-session)

### API Integration (High Priority)

- [ ] Create TanStack Query hooks for all API endpoints
  - [ ] `useLeagues()`, `useLeague(id)`, `useCreateLeague()`, `useJoinLeague()`
  - [ ] `useRounds()`, `useCreateRound()`, `useJoinRound()`
  - [ ] `useMatches()`, `useMyMatches()`, `useRescheduleMatch()`
  - [ ] `useNotifications()`, `useUpdateNotificationPreferences()`
  - [ ] `useProfile()`, `useUpdateProfile()`
  - [ ] `useConversations()`, `useSendMessage()`
- [ ] Replace all mock data in frontend pages with real API calls
- [ ] Replace all mock data in mobile screens with real API calls

### Missing Backend Routes

- [ ] Users controller & routes
  - [ ] GET `/:sport/users/me`
  - [ ] PATCH `/:sport/users/me`
  - [ ] GET `/:sport/users/:userId`
  - [ ] POST `/:sport/users/:userId/follow`
  - [ ] DELETE `/:sport/users/:userId/follow`
  - [ ] GET `/:sport/users/:userId/followers`
  - [ ] GET `/:sport/users/:userId/following`
- [ ] Scores controller & routes
  - [ ] POST `/:sport/rounds/:roundId/scores`
  - [ ] GET `/:sport/rounds/:roundId/scores`
  - [ ] PATCH `/:sport/scores/:scoreId`
  - [ ] POST `/:sport/scores/:scoreId/verify`
- [ ] Conversations controller & routes
  - [ ] GET `/:sport/conversations`
  - [ ] POST `/:sport/conversations`
  - [ ] GET `/:sport/conversations/:conversationId`
  - [ ] POST `/:sport/conversations/:conversationId`

---

## Phase 3: Real-time & Advanced Features

### WebSocket Real-time Messaging

- [ ] Write WebSocket Lambda handlers
  - [ ] `backend/src/websocket/connect.ts` - Save connection
  - [ ] `backend/src/websocket/disconnect.ts` - Remove connection
  - [ ] `backend/src/websocket/sendMessage.ts` - Save message + broadcast
- [ ] Deploy WebSocket API Gateway (infrastructure/websocket.yaml)
- [ ] Frontend WebSocket client for real-time chat
- [ ] Mobile WebSocket client for real-time chat

### Scheduled Round Processing

- [ ] EventBridge rule to check rounds past registration deadline
- [ ] Auto-trigger match scheduling when deadline passes
- [ ] Auto-cancel rounds below minimum players (with refunds)
- [ ] Send reminder notifications before deadline

### Payment Flow (Stripe)

- [ ] Frontend Stripe Elements integration for round payment
- [ ] Mobile Stripe integration
- [ ] Webhook handler for payment confirmation
- [ ] Refund processing on round cancellation

### Handicap Integration

- [ ] Research WHS/USGA API for handicap verification
- [ ] Handicap linking flow in profile
- [ ] Auto-update handicap from official source

---

## Phase 4: Polish & Launch

### Internationalization (i18n)

- [ ] Set up react-i18next (frontend)
- [ ] Set up i18next (mobile)
- [ ] English language file
- [ ] Spanish language file
- [ ] RTL language support

### Testing

- [x] Backend unit tests (Jest) - match scheduling logic (5 tests)
- [x] Backend unit tests (Jest) - validation schemas (15 tests)
- [ ] Backend unit tests (Jest) - adapters (with DynamoDB mocks)
- [ ] Frontend unit tests (React Testing Library)
- [ ] Mobile unit tests (React Native Testing Library)
- [ ] E2E tests (Cypress for web)
- [ ] E2E tests (Maestro for mobile)

### DevOps

- [ ] GitHub Actions CI/CD pipeline
- [ ] Husky pre-commit hooks (lint + test)
- [ ] commitlint for conventional commits
- [ ] Staging environment
- [ ] Production environment

### UX Polish

- [ ] Loading states and skeletons
- [ ] Error boundaries
- [ ] Empty states
- [ ] Pull-to-refresh (mobile)
- [ ] Offline support (mobile)
- [ ] Dark mode theme

---

## AWS Resources Deployed

| Resource             | Name/ID                                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CloudFormation Stack | `sport-leagues-dev`                                                                                                                                                     |
| Cognito User Pool    | `eu-west-1_cwcs3p2GY`                                                                                                                                                   |
| Cognito Client       | `62m978agioqf780khvb9h412e4`                                                                                                                                            |
| API Gateway          | `ebxuv8co28`                                                                                                                                                            |
| Lambda Function      | `sport-leagues-dev-api`                                                                                                                                                 |
| S3 Bucket            | `sport-leagues-dev-website`                                                                                                                                             |
| CloudFront           | `E2OYZGQVKXZWQX` (`d3e8loweracod4.cloudfront.net`)                                                                                                                      |
| DynamoDB Tables      | 13 tables (users, leagues, league-members, rounds, round-participants, matches, scores, conversations, chat-messages, follows, payments, notifications, ws-connections) |
