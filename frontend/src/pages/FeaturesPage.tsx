import { Box, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import {
    EmojiEvents, Groups, Chat, Leaderboard, Notifications, Payment,
    SportsGolf, Schedule, TrendingUp, Security, PhoneAndroid, Language,
} from '@mui/icons-material';

const allFeatures = [
    { icon: <EmojiEvents sx={{ fontSize: 40, color: '#FF6F00' }} />, title: 'League Management', description: 'Create and manage leagues with different categories — open, women-only, kids, beginners, seniors, intermediate, and advanced. Set member limits, entry fees, and custom rules.' },
    { icon: <Groups sx={{ fontSize: 40, color: '#1B5E20' }} />, title: 'Smart Match Scheduling', description: 'When a round starts, our algorithm automatically groups players by handicap/ability into groups of up to 8. No more manual scheduling.' },
    { icon: <Chat sx={{ fontSize: 40, color: '#1565C0' }} />, title: 'Real-time Messaging', description: 'Auto-created group chats for every match. Coordinate tee times, reschedule matches, and stay connected with your playing partners.' },
    { icon: <Leaderboard sx={{ fontSize: 40, color: '#6A1B9A' }} />, title: 'Score Tracking', description: 'Record scores hole-by-hole with full golf scorecard support. Track total strokes, putts, course rating, and slope rating.' },
    { icon: <TrendingUp sx={{ fontSize: 40, color: '#00695C' }} />, title: 'Official Handicap Integration', description: 'Link your official handicap account (WHS, USGA, EGA) to track your ranking. Your handicap updates automatically.' },
    { icon: <Notifications sx={{ fontSize: 40, color: '#E65100' }} />, title: 'Multi-channel Notifications', description: 'Choose how you want to be notified — push notifications, SMS via Twilio, or email. Never miss a round deadline or match update.' },
    { icon: <Payment sx={{ fontSize: 40, color: '#AD1457' }} />, title: 'Secure Payments', description: 'Pay round entry fees securely via Stripe. Automatic refunds if not enough players join before the deadline.' },
    { icon: <Schedule sx={{ fontSize: 40, color: '#283593' }} />, title: 'Flexible Rescheduling', description: 'Any match participant can reschedule the date and time. All other players are instantly notified via their preferred channel.' },
    { icon: <SportsGolf sx={{ fontSize: 40, color: '#2E7D32' }} />, title: 'Multi-Sport Support', description: 'Currently supporting Golf, Football, Basketball, and Cricket. Each sport has tailored scoring and ranking systems.' },
    { icon: <Security sx={{ fontSize: 40, color: '#37474F' }} />, title: 'Secure & Private', description: 'Built on AWS with Cognito authentication, encrypted data at rest, and HTTPS-only connections. Your data is safe.' },
    { icon: <PhoneAndroid sx={{ fontSize: 40, color: '#00838F' }} />, title: 'Mobile App', description: 'Available on iOS and Android via Expo. Full feature parity with the web app — manage leagues, chat, and track scores on the go.' },
    { icon: <Language sx={{ fontSize: 40, color: '#4E342E' }} />, title: 'Multi-language', description: 'Available in English and Spanish with more languages coming soon. Right-to-left language support planned.' },
];

export default function FeaturesPage() {
    return (
        <Box>
            <Box sx={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', color: 'white', pt: 14, pb: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight={800} gutterBottom>Features</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                        Everything you need to organise, play, and track your sport — built for players and league organisers alike.
                    </Typography>
                </Container>
            </Box>
            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {allFeatures.map((f) => (
                            <Grid item xs={12} sm={6} md={4} key={f.title}>
                                <Card sx={{ height: '100%', border: '1px solid #E0E0E0', boxShadow: 'none', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' } }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ mb: 2 }}>{f.icon}</Box>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>{f.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{f.description}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
