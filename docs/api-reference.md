# Sport Leagues - API Reference

**Base URL:** `https://ebxuv8co28.execute-api.eu-west-1.amazonaws.com/dev`

All endpoints require a Cognito JWT token in the `Authorization: Bearer <token>` header unless noted otherwise.

All endpoints are prefixed with `/:sport` where sport is one of: `golf`, `football`, `basketball`, `cricket` (case-insensitive).

---

## Leagues

### List Leagues

```
GET /:sport/leagues
Query: ?region=London&limit=20
```

### Create League

```
POST /:sport/leagues
Body: {
  name: string,
  description: string,
  category: "OPEN" | "WOMEN" | "KIDS" | "BEGINNERS" | "SENIORS" | "INTERMEDIATE" | "ADVANCED",
  region: string,
  location: { lat: number, lng: number, city: string, country: string, address: string },
  maxMembers: number,
  entryFee: number (cents),
  minPlayersPerRound: number,
  maxPlayersPerRound: number,
  rules?: string,
  imageUrl?: string
}
```

### Get League

```
GET /:sport/leagues/:leagueId
```

### Update League

```
PATCH /:sport/leagues/:leagueId
Body: { name?, description?, rules?, imageUrl?, isActive?, maxMembers?, entryFee? }
```

_Admin only_

### Join League

```
POST /:sport/leagues/:leagueId/join
```

### Leave League

```
DELETE /:sport/leagues/:leagueId/leave
```

### Get League Members

```
GET /:sport/leagues/:leagueId/members
```

---

## Rounds

### List Rounds for League

```
GET /:sport/leagues/:leagueId/rounds
Query: ?limit=20
```

### Create Round

```
POST /:sport/leagues/:leagueId/rounds
Body: {
  scheduledDate: string (ISO date),
  scheduledTime: string,
  venue: { name: string, address: string, lat: number, lng: number },
  minPlayers: number,
  maxPlayers: number,
  entryFee: number (cents),
  registrationDeadline: string (ISO date)
}
```

### Get Round

```
GET /:sport/rounds/:roundId
```

### Join Round (with Payment)

```
POST /:sport/rounds/:roundId/join
Response: { message, clientSecret (Stripe), paymentId }
```

### Leave Round (with Refund)

```
DELETE /:sport/rounds/:roundId/leave
```

### Get Round Participants

```
GET /:sport/rounds/:roundId/participants
```

### Cancel Round

```
POST /:sport/rounds/:roundId/cancel
```

_Round creator or league admin only. Refunds all participants._

---

## Matches

### Get Matches for Round

```
GET /:sport/matches/round/:roundId
```

### Get Match by ID

```
GET /:sport/matches/:matchId
Response: { ...match, playersWithDetails: [{ userId, displayName, handicap, ... }] }
```

### Get My Matches

```
GET /:sport/matches/me
Query: ?limit=20
```

### Reschedule Match

```
PATCH /:sport/matches/:matchId/reschedule
Body: { scheduledDate: string, scheduledTime: string }
```

_Any match participant can reschedule. All other players are notified._

### Trigger Match Scheduling (Admin)

```
POST /:sport/matches/round/:roundId/schedule
```

_Groups participants by handicap (max 8 per group), creates matches + group chats, sends notifications._

---

## Notifications

### Get My Notifications

```
GET /:sport/notifications
Query: ?limit=50
```

### Update Notification Preferences

```
PATCH /:sport/notifications/preferences
Body: {
  push: boolean,
  sms: boolean,
  email: boolean,
  phoneNumber?: string
}
```

---

## Users (Not Yet Implemented)

### Get My Profile

```
GET /:sport/users/me
```

### Update My Profile

```
PATCH /:sport/users/me
Body: { firstName?, lastName?, displayName?, avatarUrl?, location?, sportProfiles? }
```

### Get User Profile

```
GET /:sport/users/:userId
```

### Follow User

```
POST /:sport/users/:userId/follow
```

### Unfollow User

```
DELETE /:sport/users/:userId/follow
```

### Get Followers

```
GET /:sport/users/:userId/followers
```

### Get Following

```
GET /:sport/users/:userId/following
```

---

## Scores (Not Yet Implemented)

### Submit Score

```
POST /:sport/rounds/:roundId/scores
Body: {
  matchId: string,
  scoreData: GolfScoreData
}
```

### Get Round Scores

```
GET /:sport/rounds/:roundId/scores
```

### Update Score

```
PATCH /:sport/scores/:scoreId
```

### Verify Score

```
POST /:sport/scores/:scoreId/verify
```

---

## Conversations (Not Yet Implemented)

### List Conversations

```
GET /:sport/conversations
```

### Create Conversation

```
POST /:sport/conversations
Body: { type: "DIRECT" | "GROUP" | "LEAGUE", participants: string[], name?: string, leagueId?: string }
```

### Get Messages

```
GET /:sport/conversations/:conversationId
Query: ?limit=50
```

### Send Message

```
POST /:sport/conversations/:conversationId
Body: { content: string, type: "TEXT" | "IMAGE" }
```

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "details": "Validation details (if applicable)"
}
```

### Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 201  | Created                              |
| 400  | Bad Request (validation error)       |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found                            |
| 409  | Conflict (e.g., already a member)    |
| 500  | Internal Server Error                |
