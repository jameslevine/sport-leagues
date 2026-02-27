import { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { getCurrentSession } from '../services/auth';

/**
 * Hook to restore auth session on app load.
 * Checks for existing Cognito session in localStorage and restores auth state.
 */
export const useAuthInit = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const session = await getCurrentSession();
        if (session && session.isValid()) {
          const idToken = session.getIdToken();
          const payload = idToken.decodePayload();

          setUser({
            userId: payload.sub,
            email: payload.email || '',
            firstName: payload.given_name || '',
            lastName: payload.family_name || '',
            token: session.getAccessToken().getJwtToken(),
          });
        }
      } catch (err) {
        // No valid session — user stays logged out
        console.log('No existing session found');
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, [setUser]);

  return { isInitializing };
};
