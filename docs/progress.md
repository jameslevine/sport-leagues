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

### Infrastructure (100% Complete)

- [x] AWS SAM template (`template.yaml`)
- [x] Cognito User Pool + Client
- [x] 13 DynamoDB tables (PAY_PER_REQUEST)
- [x] API Gateway (REST) + Lambda
- [x] S3 + CloudFront (OAC, HTTPS-only)
- [x] Scheduled round processing Lambda (EventBridge daily trigger)
- [x] Deployed to AWS (stack: `sport-leagues-dev`)

### Backend (Express + Lambda) - 90% Complete

- [x] Project setup (TypeScript, Express, serverless-http)
- [x] DynamoDB client + Stripe client
- [x] Type definitions (Sport, User, League, Round, Match, Score, Conversation, Payment, Follow, Notification)
- [x] Cognito JWT auth middleware
- [x] Joi validation middleware
- [x] Error handler middleware

### Backend - Adapters (DynamoDB CRUD) ✅

- [x] Users adapter (getById, getByEmail, create, update, getByUserIds)
- [x] Leagues adapter (+ League Members)
- [x] Rounds adapter (+ Round Participants)
- [x] Matches adapter
- [x] Scores adapter (create, getByRound, getByUser, getByLeague, updateVerification)
- [x] Conversations adapter (+ Chat Messages)
- [x] Follows adapter (create, delete, getFollowers, getFollowing)
- [x] Payments adapter

### Backend - Controllers & Routes ✅

- [x] Users controller & routes
  - [x] GET `/:sport/users/me` (auto-creates user on first access)
  - [x] PATCH `/:sport/users/me`
  - [x] GET `/:sport/users/:userId`
  - [x] POST `/:sport/users/:userId/follow`
  - [x] DELETE `/:sport/users/:userId/follow`
  - [x] GET `/:sport/users/:userId/followers`
  - [x] GET `/:sport/users/:userId/following`
- [x] Leagues controller (CRUD, join/leave, members, leaderboard, search)
- [x] Rounds controller (CRUD, join with payment, leave with refund, cancel)
- [x] Matches controller (auto-scheduling by handicap, reschedule, CRUD)
- [x] Notification routes (get notifications, update preferences)
- [x] Scores controller & routes
  - [x] POST `/:sport/rounds/:roundId/scores` (submit)
  - [x] GET `/:sport/rounds/:roundId/scores` (get round scores)
  - [x] POST `/:sport/scores/:scoreId/verify` (⚠️ stub - returns message only)
- [x] Conversations controller & routes
  - [x] GET `/:sport/conversations` (⚠️ stub - returns empty array)
  - [x] POST `/:sport/conversations` (create with system message)
  - [x] GET `/:sport/conversations/:conversationId` (with sender details)
  - [x] POST `/:sport/conversations/:conversationId` (send + WebSocket broadcast)

### Backend - Libraries

- [x] Notification system (Twilio SMS, AWS SES email, Expo Push)
- [x] WebSocket connection manager (save/remove/broadcast)
- [x] Stripe payment integration
- [x] WebSocket Lambda handlers (connect, disconnect, sendMessage) - written but not deployed

### Frontend Web (React + Vite + MUI) - 75% Complete

- [x] Project setup (Vite, TypeScript, MUI theme)
- [x] Zustand store (auth + app state)
- [x] API client with Cognito token injection
- [x] Router with protected routes (`/app/*` prefix)
- [x] Main layout (AppBar, Drawer navigation, user menu)
- [x] Marketing layout + pages (Landing, Features, Pricing, About, FAQ, Scoring Rules)
- [x] Real Cognito auth
  - [x] Sign up with email verification (2-step: register → verify code)
  - [x] Sign in (SRP auth)
  - [x] Forgot password / Reset password
  - [x] Token refresh (automatic via Cognito SDK)
  - [x] Logout
- [x] TanStack Query hooks (leagues, rounds, matches, profile, notifications)
- [x] Leagues page (real API data, search, category filter)
- [x] League detail page (tabs: Rounds, Members, Leaderboard, Chat)
- [x] Round detail page (real API data)
- [x] Match detail page (real API data, reschedule dialog)
- [x] Profile page (real API data from `/users/me`)
- [x] Notification settings page (push/SMS/email toggles)
- [x] i18n setup (react-i18next with EN/ES translation files)
- [x] Deployed to S3/CloudFront

**⚠️ Known Issues:**

- [ ] Dashboard page uses hardcoded mock stats (not real API data)
- [ ] Messages page uses hardcoded mock conversations (not real API data)
- [ ] i18n translations exist but pages use hardcoded strings (not `useTranslation()`)

### Mobile (Expo + React Native + Paper) - 30% Complete

- [x] Project setup (Expo Router, React Native Paper)
- [x] Auth screens (Login, Register) - UI only, no Cognito
- [x] Tab navigation (Dashboard, Leagues, Messages, Profile)
- [x] Dashboard screen (mock data)
- [x] Leagues screen (mock data)
- [x] Messages screen (mock data)
- [x] Profile screen (mock data)
- [x] Match detail screen (mock data, reschedule dialog)
- [x] Notification settings screen (mock data)

**⚠️ Known Issues:**

- [ ] All screens use 100% hardcoded mock data
- [ ] No Cognito auth integration
- [ ] No API client wired to real backend
- [ ] Not tested on device

### Testing - 10% Complete

- [x] Backend unit tests (Jest) - match scheduling logic (5 tests)
- [x] Backend unit tests (Jest) - validation schemas (15 tests)

---

## Forward Plan

### Sprint 1: Complete Web MVP ✅

**Goal:** Get the web app fully functional with real data everywhere.

| #   | Task                                  | Details                                                                                                                                        | Status |
| --- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Wire Dashboard with real API data     | Created `GET /:sport/dashboard` endpoint, `useDashboard()` hook, updated DashboardPage with real stats.                                        | ✅     |
| 2   | Fix `getConversations` controller     | Added `getDbConversationsByUser()` adapter (query by pk + filter on participants). Updated controller.                                         | ✅     |
| 3   | Wire Messages page with real API data | Created `useConversations()`, `useConversationMessages()`, `useSendMessage()` hooks. Full conversation list + detail view with real-time send. | ✅     |
| 4   | Complete score verification endpoint  | Implemented proper score lookup, self-verification prevention, and `updateDbScoreVerification` call.                                           | ✅     |
| 5   | Add missing Joi validation schemas    | Created `user.ts` and `score.ts` models. Added validation middleware to users, scores, and conversations routes.                               | ✅     |
| 6   | Wire i18n into all pages              | Added `useTranslation()` to Dashboard, Login, Leagues, Messages, Profile, and NotificationSettings pages. Updated EN/ES translations.          | ✅     |

### Sprint 2: Process-Rounds & Payments ✅

**Goal:** Complete the payment flow and automated round processing.

| #   | Task                             | Details                                                                                                                             | Status |
| --- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 7   | Flesh out process-rounds Lambda  | Full implementation: DynamoDB updates, Stripe refunds, match scheduling, cancellation notifications, deadline reminders.            | ✅     |
| 8   | Add Stripe Elements to frontend  | `PaymentForm` and `PaymentDialog` components using `@stripe/react-stripe-js`.                                                       | ✅     |
| 9   | Add Stripe webhook handler       | Payment controller with webhook for `payment_intent.succeeded/failed`, plus payment history endpoints. Wired into routes.           | ✅     |
| 10  | Deploy WebSocket API Gateway     | Full WebSocket API in `template.yaml`: connect/disconnect/sendMessage routes, Lambda functions, permissions, stage with autodeploy. | ✅     |
| 11  | Add WebSocket client to frontend | `WebSocketClient` service with auto-reconnect, `useWebSocketConnection` and `useConversationWebSocket` hooks, wired into App.       | ✅     |

### Sprint 3: Mobile App

**Goal:** Get the mobile app functional with real data and auth.

| #   | Task                                | Details                                                                                           | Status |
| --- | ----------------------------------- | ------------------------------------------------------------------------------------------------- | ------ |
| 12  | Implement Cognito auth in mobile    | Use `expo-auth-session` or `amazon-cognito-identity-js`. Sign up, verify, sign in, sign out.      | ⬜     |
| 13  | Create mobile API client + hooks    | API client with token injection. TanStack Query hooks mirroring web hooks.                        | ⬜     |
| 14  | Replace mock data in mobile screens | Wire all screens to real API: Dashboard, Leagues, Messages, Profile, Match Detail, Notifications. | ⬜     |
| 15  | Test on simulators                  | iOS Simulator + Android Emulator testing. Fix platform-specific issues.                           | ⬜     |

### Sprint 4: Testing & Polish

**Goal:** Production readiness with tests, CI/CD, and UX polish.

| #   | Task                                           | Details                                                                                      | Status |
| --- | ---------------------------------------------- | -------------------------------------------------------------------------------------------- | ------ |
| 16  | Backend adapter unit tests                     | Jest tests with DynamoDB mocks for all adapters. Target 90% coverage.                        | ⬜     |
| 17  | Frontend unit tests                            | React Testing Library tests for key components and pages.                                    | ⬜     |
| 18  | Loading states, error boundaries, empty states | Add skeleton loaders, error boundary components, empty state illustrations across all pages. | ⬜     |
| 19  | Dark mode theme                                | MUI theme with dark mode toggle. Persist preference.                                         | ⬜     |
| 20  | Husky + commitlint + CI/CD                     | Pre-commit hooks (lint + test), conventional commits, GitHub Actions pipeline.               | ⬜     |

### Future (Post-MVP)

- [ ] Handicap integration (WHS/USGA API)
- [ ] RTL language support
- [ ] E2E tests (Cypress for web, Maestro for mobile)
- [ ] Mobile Stripe integration
- [ ] Mobile WebSocket client
- [ ] Pull-to-refresh and offline support (mobile)
- [ ] Staging and production environments

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
