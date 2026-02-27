import { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Alert, CircularProgress, Paper } from '@mui/material';
import { SportsGolf, SportsSoccer, SportsBasketball, SportsCricket } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store';
import { signIn } from '../services/auth';
import { useTranslation } from 'react-i18next';
import { HERO_IMAGES } from '../constants/images';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const { t } = useTranslation();

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
                setError(t('auth.userNotConfirmed'));
            } else if (error.message === 'Incorrect username or password.') {
                setError(t('auth.invalidCredentials'));
            } else {
                setError(error.message || t('common.error'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Parallax Background */}
            <Box
                sx={{
                    position: 'fixed',
                    top: '-10%',
                    left: '-10%',
                    right: '-10%',
                    bottom: '-10%',
                    backgroundImage: `url(${HERO_IMAGES.LOGIN})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    filter: 'blur(4px) brightness(0.5)',
                    transform: 'scale(1.1)',
                    zIndex: 0,
                }}
            />

            {/* Gradient Overlay */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(13,71,161,0.6) 0%, rgba(21,101,192,0.4) 50%, rgba(25,118,210,0.3) 100%)',
                    zIndex: 1,
                }}
            />

            {/* Glass Card */}
            <Paper
                elevation={0}
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: 440,
                    width: '100%',
                    mx: 2,
                    p: 5,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
            >
                {/* Logo / Branding */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                        <SportsGolf sx={{ fontSize: 28, color: 'white', opacity: 0.8 }} />
                        <SportsSoccer sx={{ fontSize: 28, color: 'white', opacity: 0.8 }} />
                        <SportsBasketball sx={{ fontSize: 28, color: 'white', opacity: 0.8 }} />
                        <SportsCricket sx={{ fontSize: 28, color: 'white', opacity: 0.8 }} />
                    </Box>
                    <Typography variant="h4" fontWeight={800} color="white" gutterBottom>
                        Sport Leagues
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Join leagues, compete with friends, track your progress
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleLogin}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label={t('auth.email')}
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                            '& .MuiOutlinedInput-input': { color: 'white' },
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label={t('auth.password')}
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                            '& .MuiOutlinedInput-input': { color: 'white' },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            mt: 3,
                            mb: 2,
                            py: 1.5,
                            borderRadius: 2,
                            fontSize: '1rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                            boxShadow: '0 4px 15px rgba(21,101,192,0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                                boxShadow: '0 6px 20px rgba(21,101,192,0.6)',
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.signIn')}
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                        <Link
                            href={ROUTES.FORGOT_PASSWORD}
                            variant="body2"
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
                        >
                            {t('auth.forgotPassword')}
                        </Link>
                        <Link
                            href={ROUTES.REGISTER}
                            variant="body2"
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
                        >
                            {t('auth.noAccount')}
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
