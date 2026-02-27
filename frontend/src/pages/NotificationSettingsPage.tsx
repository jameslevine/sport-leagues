import { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Switch, FormControlLabel,
    TextField, Button, Divider, Alert, CircularProgress,
} from '@mui/material';
import { Notifications, Sms, Email, PhoneAndroid } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';

export default function NotificationSettingsPage() {
    const { data: profile, isLoading } = useProfile();
    const updateProfile = useUpdateProfile();
    const { t } = useTranslation();

    const [push, setPush] = useState(true);
    const [sms, setSms] = useState(false);
    const [email, setEmail] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [saved, setSaved] = useState(false);

    // Load current preferences from profile
    useEffect(() => {
        if (profile) {
            const prefs = (profile as any)?.notificationPreferences;
            if (prefs) {
                setPush(prefs.push ?? true);
                setSms(prefs.sms ?? false);
                setEmail(prefs.email ?? true);
                setPhoneNumber(prefs.phoneNumber || '');
            }
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync({
                notificationPreferences: {
                    push,
                    sms,
                    email,
                    phoneNumber: sms ? phoneNumber : undefined,
                },
            } as any);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save notification preferences:', err);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications /> {t('notifications.title')}
            </Typography>

            {saved && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {t('notifications.saved')}
                </Alert>
            )}

            {updateProfile.isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to save preferences. Please try again.
                </Alert>
            )}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>{t('notifications.channels')}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {t('notifications.channelsDescription')}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <PhoneAndroid color="primary" />
                        <FormControlLabel
                            control={<Switch checked={push} onChange={(e) => setPush(e.target.checked)} />}
                            label={t('notifications.push')}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 5, mb: 3 }}>
                        {t('notifications.pushDescription')}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Sms color="primary" />
                        <FormControlLabel
                            control={<Switch checked={sms} onChange={(e) => setSms(e.target.checked)} />}
                            label={t('notifications.sms')}
                        />
                    </Box>
                    {sms && (
                        <TextField
                            label={t('notifications.phoneNumber')}
                            placeholder="+44 7700 900000"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            fullWidth
                            sx={{ ml: 5, mb: 3, maxWidth: 300 }}
                            size="small"
                        />
                    )}
                    {!sms && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 5, mb: 3 }}>
                            {t('notifications.smsDescription')}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Email color="primary" />
                        <FormControlLabel
                            control={<Switch checked={email} onChange={(e) => setEmail(e.target.checked)} />}
                            label={t('notifications.emailNotifications')}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 5, mb: 3 }}>
                        {t('notifications.emailDescription')}
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>{t('notifications.whatYouGet')}</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2">• {t('notifications.roundDeadline')}</Typography>
                    <Typography variant="body2">• {t('notifications.matchScheduling')}</Typography>
                    <Typography variant="body2">• {t('notifications.matchRescheduling')}</Typography>
                    <Typography variant="body2">• {t('notifications.roundStarting')}</Typography>
                    <Typography variant="body2">• {t('notifications.paymentUpdates')}</Typography>
                    <Typography variant="body2">• {t('notifications.newMessages')}</Typography>
                </CardContent>
            </Card>

            <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={updateProfile.isPending}
            >
                {updateProfile.isPending ? <CircularProgress size={24} color="inherit" /> : t('notifications.savePreferences')}
            </Button>
        </Box>
    );
}
