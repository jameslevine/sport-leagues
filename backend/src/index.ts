import cors from 'cors';
import express from 'express';
import serverless from 'serverless-http';

import { cognitoAuthMiddleware } from './middleware/cognito-auth';
import { errorHandler } from './middleware/error-handler';
import { router as leaguesRouter } from './routes/leagues';
import { leagueRoundsRouter, roundsRouter } from './routes/rounds';
import { router as matchesRouter } from './routes/matches';
import { router as notificationsRouter } from './routes/notifications';
import { router as usersRouter } from './routes/users';
import { roundScoresRouter, scoresRouter } from './routes/scores';
import { router as conversationsRouter } from './routes/conversations';
import { router as dashboardRouter } from './routes/dashboard';
import { router as paymentsRouter } from './routes/payments';
import { router as uploadsRouter } from './routes/uploads';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Amz-Date',
      'X-Api-Key',
      'X-Amz-Security-Token',
    ],
    maxAge: 300,
  }),
);

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(cognitoAuthMiddleware);

// Routes
app.use('/:sport/dashboard', dashboardRouter);
app.use('/:sport/users', usersRouter);
app.use('/:sport/leagues', leaguesRouter);
app.use('/:sport/leagues/:leagueId/rounds', leagueRoundsRouter);
app.use('/:sport/rounds', roundsRouter);
app.use('/:sport/rounds/:roundId/scores', roundScoresRouter);
app.use('/:sport/scores', scoresRouter);
app.use('/:sport/matches', matchesRouter);
app.use('/:sport/conversations', conversationsRouter);
app.use('/:sport/notifications', notificationsRouter);
app.use('/:sport/payments', paymentsRouter);
app.use('/:sport/uploads', uploadsRouter);

// Error handler
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Lambda handler
export const handler = serverless(app);
