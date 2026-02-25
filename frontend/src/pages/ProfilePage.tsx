import { Box, Typography, Avatar, Card, CardContent, Grid, Divider, CircularProgress, Alert, Button } from '@mui/material';
import { useProfile } from '../hooks/useProfile';
import { useAuthStore } from '../store';
import { signOut } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function ProfilePage() {
    const { data: profile, isLoading, error } = useProfile();
    const authUser = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut();
        logout();
        navigate(ROUTES.LOGIN);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const user = profile || authUser;

    return (
        <Box>
            {error && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Could not load profile from server. Showing cached data.
                </Alert>
            )}

            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, fontSize: 32 }}>
                        {(user as any)?.firstName?.[0] || (user as any)?.displayName?.[0] || 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h5">
                            {(user as any)?.firstName} {(user as any)?.lastName}
                        </Typography>
                        <Typography color="text.secondary">{(user as any)?.email}</Typography>
                        {(user as any)?.displayName && (
                            <Typography variant="body2" color="text.secondary">
                                @{(user as any)?.displayName}
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Sport Profile</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography>
                                Handicap: {(profile as any)?.sportProfiles?.GOLF?.handicapIndex ?? '--'}
                            </Typography>
                            <Typography color="text.secondary">
                                Link your official handicap account to track your ranking
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Statistics</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography>Followers: {(profile as any)?.followersCount ?? 0}</Typography>
                            <Typography>Following: {(profile as any)?.followingCount ?? 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate(ROUTES.NOTIFICATION_SETTINGS)}
                >
                    Notification Settings
                </Button>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                    Sign Out
                </Button>
            </Box>
        </Box>
    );
}
