# Sport Leagues - Deployment Guide

## Environments

| Environment | Stack Name              | Region    | Status       |
| ----------- | ----------------------- | --------- | ------------ |
| Dev         | `sport-leagues-dev`     | eu-west-1 | ✅ Deployed  |
| Staging     | `sport-leagues-staging` | eu-west-1 | Not deployed |
| Production  | `sport-leagues-prod`    | eu-west-1 | Not deployed |

## Dev Environment URLs

| Service           | URL                                                        |
| ----------------- | ---------------------------------------------------------- |
| Website           | https://d3e8loweracod4.cloudfront.net                      |
| API               | https://ebxuv8co28.execute-api.eu-west-1.amazonaws.com/dev |
| Cognito User Pool | eu-west-1_cwcs3p2GY                                        |
| Cognito Client ID | 62m978agioqf780khvb9h412e4                                 |

## Prerequisites

- AWS CLI configured with appropriate credentials
- SAM CLI installed (`sam --version`)
- Node.js 18+ installed
- For Amazon internal: Run `mwinit -f` before deploying

## Deploy Backend + Infrastructure

```bash
# 1. Build the backend TypeScript
cd backend && npm run build && cd ..

# 2. Build SAM package
sam build

# 3. Deploy to AWS
sam deploy \
  --stack-name sport-leagues-dev \
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
  --resolve-s3 \
  --no-confirm-changeset \
  --parameter-overrides Environment=dev ProjectName=sport-leagues \
  --region eu-west-1

# 4. View stack outputs
aws cloudformation describe-stacks \
  --stack-name sport-leagues-dev \
  --region eu-west-1 \
  --query 'Stacks[0].Outputs' \
  --output table
```

## Deploy Frontend

```bash
# 1. Build frontend with production env vars
cd frontend
npm run build

# 2. Upload to S3
aws s3 sync dist/ s3://sport-leagues-dev-website --delete --region eu-west-1

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E2OYZGQVKXZWQX \
  --paths "/*" \
  --region eu-west-1
```

## Deploy to Staging/Production

```bash
# Staging
sam deploy \
  --stack-name sport-leagues-staging \
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
  --resolve-s3 \
  --parameter-overrides Environment=staging ProjectName=sport-leagues \
  --region eu-west-1

# Production (with confirmation)
sam deploy \
  --stack-name sport-leagues-prod \
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
  --resolve-s3 \
  --parameter-overrides Environment=prod ProjectName=sport-leagues \
  --region eu-west-1
```

## Environment Variables

### Backend (Lambda)

Set automatically via CloudFormation. For local development, create `backend/.env`:

```env
NODE_ENV=development
COGNITO_USER_POOL_ID=eu-west-1_cwcs3p2GY
COGNITO_CLIENT_ID=62m978agioqf780khvb9h412e4
USERS_TABLE=sport-leagues-dev-users
LEAGUES_TABLE=sport-leagues-dev-leagues
LEAGUE_MEMBERS_TABLE=sport-leagues-dev-league-members
ROUNDS_TABLE=sport-leagues-dev-rounds
ROUND_PARTICIPANTS_TABLE=sport-leagues-dev-round-participants
MATCHES_TABLE=sport-leagues-dev-matches
SCORES_TABLE=sport-leagues-dev-scores
CONVERSATIONS_TABLE=sport-leagues-dev-conversations
CHAT_MESSAGES_TABLE=sport-leagues-dev-chat-messages
FOLLOWS_TABLE=sport-leagues-dev-follows
PAYMENTS_TABLE=sport-leagues-dev-payments
NOTIFICATIONS_TABLE=sport-leagues-dev-notifications
WEBSOCKET_CONNECTIONS_TABLE=sport-leagues-dev-ws-connections
STRIPE_SECRET_KEY=sk_test_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+44...
SES_FROM_EMAIL=noreply@sportleagues.com
```

### Frontend

Create `frontend/.env.production`:

```env
VITE_API_URL=https://ebxuv8co28.execute-api.eu-west-1.amazonaws.com/dev
VITE_COGNITO_USER_POOL_ID=eu-west-1_cwcs3p2GY
VITE_COGNITO_CLIENT_ID=62m978agioqf780khvb9h412e4
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_WEBSOCKET_URL=wss://...
```

## Teardown

```bash
# WARNING: This will delete ALL resources including DynamoDB tables with data
aws cloudformation delete-stack --stack-name sport-leagues-dev --region eu-west-1

# Empty S3 bucket first (required before stack deletion)
aws s3 rm s3://sport-leagues-dev-website --recursive --region eu-west-1
```

## Monitoring

```bash
# View Lambda logs
aws logs tail /aws/lambda/sport-leagues-dev-api --follow --region eu-west-1

# View API Gateway access logs
aws logs tail /aws/apigateway/sport-leagues-dev-api --follow --region eu-west-1
```
