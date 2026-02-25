import { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Switch, FormControlLabel,
    TextField, Button, Divider, Alert,
} from '@mui/material';
import { Notifications, Sms, Email, PhoneAndroid } from '@mui/icons-material';

export default function NotificationSettingsPage() {
    const [push, setPush] = useState(true);
    const [sms, setSms] = useState(false);
    const [email, setEmail] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // TODO: Call API to update notification preferences
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications /> Notification Settings
            </Typography>

            {saved && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Notification preferences saved successfully!
                </Alert>
            )}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Notification Channels</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Choose how you want to receive notifications about rounds, matches, and messages.
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <PhoneAndroid color="primary" />
                        <FormControlLabel
                            control={<Switch checked={push} onChange={(e) => setPush(e.target.checked)} />}
                            label="Push Notifications"
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 5, mb: 3 }}>
                        Receive instant notifications on your mobile device
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Sms color="primary" />
                        <FormControlLabel
                            control={<Switch checked={sms} onChange={(e) => setSms(e.target.checked)} />}
                            label="SMS Notifications"
                        />
                    </Box>
                    {sms && (
                        <TextField
                            label="Phone Number"
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
                            Receive text messages for important updates like match scheduling
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Email color="primary" />
                        <FormControlLabel
                            control={<Switch checked={email} onChange={(e) => setEmail(e.target.checked)} />}
                            label="Email Notifications"
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 5, mb: 3 }}>
                        Receive email summaries and important updates
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>What you'll be notified about</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2">• Round registration deadline reminders</Typography>
                    <Typography variant="body2">• Match scheduling (when groups are assigned)</Typography>
                    <Typography variant="body2">• Match rescheduling by other players</Typography>
                    <Typography variant="body2">• Round starting notifications</Typography>
                    <Typography variant="body2">• Payment confirmations and refunds</Typography>
                    <Typography variant="body2">• New messages in match group chats</Typography>
                </CardContent>
            </Card>

            <Button variant="contained" size="large" onClick={handleSave}>
                Save Preferences
            </Button>
        </Box>
    );
}
