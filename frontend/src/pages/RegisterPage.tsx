import { useState } from 'react';
import {
    Box, Button, Container, TextField, Typography, Link, Alert, CircularProgress, Stepper, Step, StepLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { signUp, confirmSignUp } from '../services/auth';

export default function RegisterPage() {
    const [step, setStep] = useState(0); // 0 = register, 1 = verify
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols');
            return;
        }

        setLoading(true);
        try {
            await signUp({ email, password, firstName, lastName });
            setStep(1); // Move to verification step
        } catch (err: unknown) {
            const error = err as { message?: string };
            if (error.message?.includes('already exists')) {
                setError('An account with this email already exists');
            } else {
                setError(error.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await confirmSignUp(email, verificationCode);
            navigate(ROUTES.LOGIN);
        } catch (err: unknown) {
            const error = err as { message?: string };
            setError(error.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h4" gutterBottom>
                    Create Account
                </Typography>

                <Stepper activeStep={step} sx={{ width: '100%', mb: 3 }}>
                    <Step><StepLabel>Register</StepLabel></Step>
                    <Step><StepLabel>Verify Email</StepLabel></Step>
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {step === 0 ? (
                    <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal" required fullWidth label="First Name"
                            value={firstName} onChange={(e) => setFirstName(e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal" required fullWidth label="Last Name"
                            value={lastName} onChange={(e) => setLastName(e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal" required fullWidth label="Email Address" type="email"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal" required fullWidth label="Password" type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            helperText="Min 8 chars with uppercase, lowercase, number, and symbol"
                        />
                        <TextField
                            margin="normal" required fullWidth label="Confirm Password" type="password"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link href={ROUTES.LOGIN} variant="body2">
                                Already have an account? Sign In
                            </Link>
                        </Box>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleVerify} sx={{ mt: 1, width: '100%' }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            We've sent a verification code to <strong>{email}</strong>. Please check your inbox.
                        </Alert>
                        <TextField
                            margin="normal" required fullWidth label="Verification Code"
                            value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}
                            disabled={loading} placeholder="Enter 6-digit code"
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Email'}
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
}
