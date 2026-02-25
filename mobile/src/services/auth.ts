import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://ebxuv8co28.execute-api.eu-west-1.amazonaws.com/dev';
const COGNITO_USER_POOL_ID = 'eu-west-1_cwcs3p2GY';
const COGNITO_CLIENT_ID = '62m978agioqf780khvb9h412e4';
const COGNITO_REGION = 'eu-west-1';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export interface AuthUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

// Cognito auth via REST API (no SDK needed for mobile)
const cognitoRequest = async (
  action: string,
  params: Record<string, unknown>,
) => {
  const response = await fetch(
    `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`,
      },
      body: JSON.stringify(params),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.__type || 'Auth request failed');
  }
  return data;
};

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<string> => {
  const result = await cognitoRequest('SignUp', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'given_name', Value: firstName },
      { Name: 'family_name', Value: lastName },
    ],
  });
  return result.UserSub;
};

export const confirmSignUp = async (
  email: string,
  code: string,
): Promise<void> => {
  await cognitoRequest('ConfirmSignUp', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  });
};

export const signIn = async (
  email: string,
  password: string,
): Promise<AuthUser> => {
  const result = await cognitoRequest('InitiateAuth', {
    ClientId: COGNITO_CLIENT_ID,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  const idToken = result.AuthenticationResult.IdToken;
  const accessToken = result.AuthenticationResult.AccessToken;

  // Decode ID token to get user info
  const payload = JSON.parse(atob(idToken.split('.')[1]));

  const user: AuthUser = {
    userId: payload.sub,
    email: payload.email || email,
    firstName: payload.given_name || '',
    lastName: payload.family_name || '',
    token: accessToken,
  };

  // Store tokens securely
  await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

  return user;
};

export const signOut = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
};

export const getStoredUser = async (): Promise<AuthUser | null> => {
  const userJson = await SecureStore.getItemAsync(USER_KEY);
  if (!userJson) return null;
  return JSON.parse(userJson);
};

export const getStoredToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(TOKEN_KEY);
};

export const forgotPassword = async (email: string): Promise<void> => {
  await cognitoRequest('ForgotPassword', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
  });
};

export const confirmForgotPassword = async (
  email: string,
  code: string,
  newPassword: string,
): Promise<void> => {
  await cognitoRequest('ConfirmForgotPassword', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
  });
};
