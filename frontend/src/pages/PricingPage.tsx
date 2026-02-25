import { Box, Button, Card, CardContent, Container, Grid, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircle, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function PricingPage() {
    const navigate = useNavigate();

    return (
        <Box>
            <Box sx={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', color: 'white', pt: 14, pb: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight={800} gutterBottom>Simple, Fair Pricing</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                        Free to join. Pay only when you play. Automatic refunds if rounds don't fill up.
                    </Typography>
                </Container>
            </Box>
            <Box sx={{ py: 8 }}>
                <Container maxWidth="md">
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <Card sx={{ height: '100%', border: '2px solid #E0E0E0' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="overline" color="text.secondary">Free</Typography>
                                    <Typography variant="h3" fontWeight={800}>£0</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Forever free</Typography>
                                    <List dense>
                                        {[
                                            'Create an account',
                                            'Browse all leagues',
                                            'Join unlimited leagues',
                                            'View leaderboards',
                                            'Follow other players',
                                            'Track your handicap',
                                            'Push & email notifications',
                                        ].map((item) => (
                                            <ListItem key={item} disableGutters>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                                                </ListItemIcon>
                                                <ListItemText primary={item} />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        size="large"
                                        onClick={() => navigate(ROUTES.REGISTER)}
                                        sx={{ mt: 2 }}
                                    >
                                        Get Started
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ height: '100%', border: '2px solid #1B5E20', position: 'relative', overflow: 'visible' }}>
                                <Box sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', bgcolor: '#1B5E20', color: 'white', px: 3, py: 0.5, borderRadius: 2, fontWeight: 600, fontSize: 14 }}>
                                    Most Popular
                                </Box>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="overline" color="primary">Per Round</Typography>
                                    <Typography variant="h3" fontWeight={800}>£5-£25</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Set by league organisers</Typography>
                                    <List dense>
                                        {[
                                            'Everything in Free',
                                            'Join rounds with entry fee',
                                            'Auto-matched by handicap',
                                            'Group chat for your match',
                                            'SMS notifications',
                                            'Score verification',
                                            'Automatic refund if round cancelled',
                                            'Priority support',
                                        ].map((item) => (
                                            <ListItem key={item} disableGutters>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                                                </ListItemIcon>
                                                <ListItemText primary={item} />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        onClick={() => navigate(ROUTES.REGISTER)}
                                        sx={{ mt: 2 }}
                                        endIcon={<ArrowForward />}
                                    >
                                        Start Playing
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 8, textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>Refund Policy</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                            If a round doesn't reach the minimum number of players by the registration deadline,
                            all entry fees are automatically refunded to your original payment method. No questions asked.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
