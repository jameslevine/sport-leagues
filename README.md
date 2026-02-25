# Sport Leagues

A multi-platform application (Web + iOS/Android) for managing local sports leagues, rounds, scoring, messaging, and official ranking integration.

## Features

- **League Management**: Join local leagues with different categories (women only, kids, beginners, etc.)
- **Round Matching**: Join rounds and get matched with other league members
- **Score Tracking**: Track scores with official ranking integration (e.g., golf handicap)
- **Social**: Message other players, follow users, view their scores
- **Payments**: Pay to join rounds with automatic refunds if minimum players not met
- **Multi-Sport**: Support for multiple sports with sport-specific ranking systems

## Tech Stack

### Backend

- Node.js + TypeScript + Express
- AWS Lambda + API Gateway
- DynamoDB
- Amazon Cognito (Auth)
- Stripe (Payments)

### Web Frontend

- React 18 + TypeScript
- Vite
- MUI (Material UI)
- TanStack Query
- Zustand

### Mobile

- Expo SDK + React Native + TypeScript
- React Native Paper
- Expo Router
- TanStack Query
- Zustand

### Infrastructure

- AWS SAM CLI + CloudFormation
- S3 + CloudFront (Web hosting)
- DynamoDB
- Cognito User Pools
- API Gateway
- Lambda

## Project Structure

```
sport-leagues/
├── backend/           → Express Lambda API
├── frontend/          → React web application
├── mobile/            → Expo React Native app
├── infrastructure/    → CloudFormation templates
├── docs/              → Architecture and design docs
└── shared/            → Shared types and constants
```

## Getting Started

See individual README files in each directory for setup instructions.
