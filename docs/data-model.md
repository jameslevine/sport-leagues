# Sport Leagues - Data Model

## DynamoDB Tables

All tables use a single-table-inspired design with `pk` (partition key) and `sk` (sort key) as the primary key, plus GSIs for alternative access patterns.

---

## Users Table (`sport-leagues-dev-users`)

**Access Patterns:**

- Get user by sport + userId → PK/SK
- Get user by email → GSI1

| Key    | Pattern            |
| ------ | ------------------ |
| pk     | `USER#{sportType}` |
| sk     | `USER#{userId}`    |
| gsi1pk | `USER#{email}`     |
| gsi1sk | `USER#{userId}`    |

**Attributes:** userId, email, firstName, lastName, displayName, avatarUrl, location, sportProfiles, notificationPreferences (push/sms/email/phoneNumber), followersCount, followingCount, createdAt, updatedAt

---

## Leagues Table (`sport-leagues-dev-leagues`)

**Access Patterns:**

- List leagues by sport → PK query
- List leagues by region → GSI1

| Key    | Pattern              |
| ------ | -------------------- |
| pk     | `LEAGUE#{sportType}` |
| sk     | `LEAGUE#{leagueId}`  |
| gsi1pk | `LEAGUE#{region}`    |
| gsi1sk | `LEAGUE#{leagueId}`  |

**Attributes:** leagueId, name, description, sportType, category, region, location, maxMembers, memberCount, entryFee, minPlayersPerRound, maxPlayersPerRound, rules, imageUrl, isActive, createdBy, createdAt, updatedAt

---

## League Members Table (`sport-leagues-dev-league-members`)

**Access Patterns:**

- Get members of a league → PK + SK prefix
- Get leagues for a user → GSI1

| Key    | Pattern                           |
| ------ | --------------------------------- |
| pk     | `LEAGUEMEMBER#{sportType}`        |
| sk     | `LEAGUE#{leagueId}#USER#{userId}` |
| gsi1pk | `USER#{userId}`                   |
| gsi1sk | `LEAGUE#{leagueId}`               |

**Attributes:** leagueId, userId, role (ADMIN/MODERATOR/MEMBER), joinedAt, status (ACTIVE/SUSPENDED/LEFT)

---

## Rounds Table (`sport-leagues-dev-rounds`)

**Access Patterns:**

- Get round by sport + roundId → PK/SK
- List rounds by league (sorted by date) → GSI1

| Key    | Pattern                 |
| ------ | ----------------------- |
| pk     | `ROUND#{sportType}`     |
| sk     | `ROUND#{roundId}`       |
| gsi1pk | `LEAGUE#{leagueId}`     |
| gsi1sk | `ROUND#{scheduledDate}` |

**Attributes:** roundId, leagueId, sportType, scheduledDate, scheduledTime, venue, status (OPEN/FULL/IN_PROGRESS/COMPLETED/CANCELLED/REFUNDED), minPlayers, maxPlayers, currentPlayers, entryFee, registrationDeadline, createdBy, createdAt, updatedAt

---

## Round Participants Table (`sport-leagues-dev-round-participants`)

**Access Patterns:**

- Get participants of a round → PK + SK prefix
- Get rounds for a user → GSI1

| Key    | Pattern                         |
| ------ | ------------------------------- |
| pk     | `ROUNDPARTICIPANT#{sportType}`  |
| sk     | `ROUND#{roundId}#USER#{userId}` |
| gsi1pk | `USER#{userId}`                 |
| gsi1sk | `ROUND#{roundId}`               |

**Attributes:** roundId, userId, paymentId, paymentStatus (PENDING/PAID/REFUNDED), status (REGISTERED/CONFIRMED/CANCELLED/NO_SHOW), joinedAt

---

## Matches Table (`sport-leagues-dev-matches`)

**Access Patterns:**

- Get match by sport + matchId → PK/SK
- Get matches for a round → GSI1
- Get matches for a user → GSI2

| Key    | Pattern                        |
| ------ | ------------------------------ |
| pk     | `MATCH#{sportType}`            |
| sk     | `MATCH#{matchId}`              |
| gsi1pk | `ROUND#{roundId}`              |
| gsi1sk | `MATCH#{matchId}`              |
| gsi2pk | `USER#{userId}` (first player) |
| gsi2sk | `MATCH#{scheduledDate}`        |

**Attributes:** matchId, roundId, leagueId, sportType, players (string[]), groupNumber, scheduledDate, scheduledTime, venue, status (SCHEDULED/RESCHEDULED/IN_PROGRESS/COMPLETED/CANCELLED), groupChatId, scores (Record<userId, number>), rescheduledBy, rescheduledAt, createdAt, updatedAt

**Match Scheduling Algorithm:**

1. Sort all round participants by handicap index (ascending)
2. Chunk into groups of max 8 players
3. Create a Match record for each group
4. Create a GROUP conversation for each match
5. Post system message in each group chat
6. Send notifications to all players

---

## Scores Table (`sport-leagues-dev-scores`)

**Access Patterns:**

- Get scores for a round → PK + SK prefix
- Get scores for a user → GSI1
- Get scores for a league → GSI2

| Key    | Pattern                         |
| ------ | ------------------------------- |
| pk     | `SCORE#{sportType}`             |
| sk     | `ROUND#{roundId}#USER#{userId}` |
| gsi1pk | `USER#{userId}`                 |
| gsi1sk | `SCORE#{roundId}`               |
| gsi2pk | `LEAGUE#{leagueId}`             |
| gsi2sk | `SCORE#{scheduledDate}`         |

**Attributes:** scoreId, roundId, leagueId, matchId, userId, sportType, scoreData (GolfScoreData), totalScore, verified, verifiedBy, createdAt, updatedAt

**Golf Score Data:**

```json
{
  "holes": [{ "hole": 1, "par": 4, "strokes": 5, "putts": 2 }],
  "totalStrokes": 82,
  "totalPutts": 32,
  "handicapIndex": 15.2,
  "courseHandicap": 17,
  "netScore": 65,
  "courseName": "Royal Links",
  "courseRating": 72.1,
  "slopeRating": 131
}
```

---

## Conversations Table (`sport-leagues-dev-conversations`)

**Access Patterns:**

- Get conversation by sport + conversationId → PK/SK
- Get conversations for a league → GSI1

| Key    | Pattern                         |
| ------ | ------------------------------- |
| pk     | `CONVERSATION#{sportType}`      |
| sk     | `CONVERSATION#{conversationId}` |
| gsi1pk | `LEAGUE#{leagueId}`             |
| gsi1sk | `CONVERSATION#{conversationId}` |

**Attributes:** conversationId, leagueId, type (DIRECT/GROUP/LEAGUE), participants (string[]), name, lastMessageAt, createdAt

---

## Chat Messages Table (`sport-leagues-dev-chat-messages`)

**Access Patterns:**

- Get messages for a conversation (sorted by time) → GSI1

| Key    | Pattern                         |
| ------ | ------------------------------- |
| pk     | `CHATMESSAGE#{sportType}`       |
| sk     | `MSG#{timestamp}#{messageId}`   |
| gsi1pk | `CONVERSATION#{conversationId}` |
| gsi1sk | `MSG#{timestamp}`               |

**Attributes:** messageId, conversationId, userId, content, type (TEXT/IMAGE/SYSTEM), createdAt

---

## Follows Table (`sport-leagues-dev-follows`)

**Access Patterns:**

- Get users a person is following → PK + SK prefix
- Get followers of a user → GSI1

| Key    | Pattern                                         |
| ------ | ----------------------------------------------- |
| pk     | `FOLLOW#{sportType}`                            |
| sk     | `FOLLOWER#{followerId}#FOLLOWING#{followingId}` |
| gsi1pk | `FOLLOWING#{followingId}`                       |
| gsi1sk | `FOLLOWER#{followerId}`                         |

**Attributes:** followerId, followingId, createdAt

---

## Payments Table (`sport-leagues-dev-payments`)

**Access Patterns:**

- Get payment by sport + paymentId → PK/SK
- Get payments for a user → GSI1
- Get payments for a round → GSI2

| Key    | Pattern               |
| ------ | --------------------- |
| pk     | `PAYMENT#{sportType}` |
| sk     | `PAYMENT#{paymentId}` |
| gsi1pk | `USER#{userId}`       |
| gsi1sk | `PAYMENT#{createdAt}` |
| gsi2pk | `ROUND#{roundId}`     |
| gsi2sk | `PAYMENT#{paymentId}` |

**Attributes:** paymentId, userId, roundId, stripePaymentIntentId, amount, currency, status (PENDING/SUCCEEDED/REFUNDED/FAILED), refundReason, createdAt, updatedAt

---

## Notifications Table (`sport-leagues-dev-notifications`)

**Access Patterns:**

- Get notifications for a user (sorted by time) → PK query
- Get notifications by type → GSI1

| Key    | Pattern                                     |
| ------ | ------------------------------------------- |
| pk     | `NOTIFICATION#{userId}`                     |
| sk     | `NOTIFICATION#{createdAt}#{notificationId}` |
| gsi1pk | `NOTIFICATION#{type}`                       |
| gsi1sk | `NOTIFICATION#{createdAt}`                  |

**Attributes:** notificationId, userId, type, channel (PUSH/SMS/EMAIL), status (PENDING/SENT/FAILED), title, body, data, sentAt, createdAt

**Notification Types:** ROUND_STARTING, ROUND_CUTOFF_REMINDER, MATCH_SCHEDULED, MATCH_RESCHEDULED, MATCH_STARTING, MATCH_COMPLETED, ROUND_CANCELLED, PAYMENT_RECEIVED, PAYMENT_REFUNDED, NEW_MESSAGE, LEAGUE_JOINED

---

## WebSocket Connections Table (`sport-leagues-dev-ws-connections`)

**Access Patterns:**

- Get connections for a user → PK query

| Key | Pattern               |
| --- | --------------------- |
| pk  | `WSCONN#{userId}`     |
| sk  | `CONN#{connectionId}` |

**Attributes:** connectionId, userId, connectedAt, ttl (DynamoDB TTL for auto-cleanup after 24h)
