import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID } from '../constants/routes';

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_USER_POOL_ID,
  ClientId: COGNITO_CLIENT_ID,
});

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export const signUp = (params: SignUpParams): Promise<string> => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: params.email }),
      new CognitoUserAttribute({ Name: 'given_name', Value: params.firstName }),
      new CognitoUserAttribute({ Name: 'family_name', Value: params.lastName }),
    ];

    userPool.signUp(
      params.email,
      params.password,
      attributeList,
      [],
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result?.userSub || '');
      },
    );
  });
};

export const confirmSignUp = (email: string, code: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const signIn = (params: SignInParams): Promise<CognitoUserSession> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: params.email,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: params.email,
      Password: params.password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        resolve(session);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

export const signOut = (): void => {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
  }
};

export const getCurrentSession = (): Promise<CognitoUserSession | null> => {
  return new Promise((resolve) => {
    const currentUser = userPool.getCurrentUser();
    if (!currentUser) {
      resolve(null);
      return;
    }

    currentUser.getSession(
      (err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session || !session.isValid()) {
          resolve(null);
          return;
        }
        resolve(session);
      },
    );
  });
};

export const getIdToken = async (): Promise<string | null> => {
  const session = await getCurrentSession();
  return session?.getIdToken().getJwtToken() || null;
};

export const getAccessToken = async (): Promise<string | null> => {
  const session = await getCurrentSession();
  return session?.getAccessToken().getJwtToken() || null;
};

export const forgotPassword = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.forgotPassword({
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
};

export const confirmForgotPassword = (
  email: string,
  code: string,
  newPassword: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
};
