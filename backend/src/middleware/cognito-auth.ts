import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID!,
});

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email?: string;
        'cognito:username'?: string;
        [key: string]: unknown;
      };
    }
  }
}

export const cognitoAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const payload = await verifier.verify(token);
    req.user = payload as unknown as Request['user'];
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
