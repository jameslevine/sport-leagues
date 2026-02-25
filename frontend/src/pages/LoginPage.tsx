import { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Link, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store';
import { signIn } from '../services/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const session = await signIn({ email, password });
            const idToken = session.getIdToken();
            const payload = idToken.decodePayload();

            setUser({
                userId: payload.sub,
                email: payload.email || email,
                firstName: payload.given_name || '',
                lastName: payload.family_name || '',
                token: session.getAccessToken().getJwtToken(),
            });

            navigate('/app/dashboard');
        } catch (err: unknown) {
            const error = err as { message?: string };
            if (error.message === 'User is not confirmed.') {
                setError('Please verify your email address first. Check your inbox for a verification code.');
            } else if (error.message === 'Incorrect username or password.') {
                setError('Invalid email or password');
            } else {
                setError(error.message || 'An error occurred during sign in');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4" gutterBottom>
                    Sport Leagues
                </Typography>
                <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
                    Sign in to your account
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link href={ROUTES.FORGOT_PASSWORD} variant="body2">
                            Forgot password?
                        </Link>
                        <Link href={ROUTES.REGISTER} variant="body2">
                            Don't have an account? Sign Up
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
