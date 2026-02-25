import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { Favorite, EmojiEvents, Groups, TrendingUp } from '@mui/icons-material';

export default function AboutPage() {
    return (
        <Box>
            <Box sx={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', color: 'white', pt: 14, pb: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight={800} gutterBottom>About Sport Leagues</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                        We're on a mission to make sport more accessible, social, and fun for everyone.
                    </Typography>
                </Container>
            </Box>

            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Our Story</Typography>
                            <Typography variant="body1" color="text.secondary" paragraph lineHeight={1.8}>
                                Sport Leagues was born from a simple frustration: finding people to play sport with shouldn't be hard.
                                Whether you're a scratch golfer or a complete beginner, everyone deserves to play with people at their level.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph lineHeight={1.8}>
                                We built Sport Leagues to solve this problem. Our platform automatically matches you with players of similar
                                ability, handles all the scheduling, payments, and communication — so you can focus on what matters: playing.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph lineHeight={1.8}>
                                From local golf societies to weekend football leagues, we're helping communities come together through sport.
                                And we're just getting started.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ bgcolor: '#F5F5F5', borderRadius: 4, p: 4 }}>
                                <Grid container spacing={3}>
                                    {[
                                        { icon: <EmojiEvents sx={{ fontSize: 36, color: '#FF6F00' }} />, label: '50+', sub: 'Active Leagues' },
                                        { icon: <Groups sx={{ fontSize: 36, color: '#1B5E20' }} />, label: '1,200+', sub: 'Players' },
                                        { icon: <TrendingUp sx={{ fontSize: 36, color: '#1565C0' }} />, label: '5,000+', sub: 'Rounds Played' },
                                        { icon: <Favorite sx={{ fontSize: 36, color: '#C62828' }} />, label: '4', sub: 'Sports' },
                                    ].map((stat) => (
                                        <Grid item xs={6} key={stat.sub}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                {stat.icon}
                                                <Typography variant="h4" fontWeight={800}>{stat.label}</Typography>
                                                <Typography variant="body2" color="text.secondary">{stat.sub}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ py: 8, bgcolor: '#FAFAFA' }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">Our Values</Typography>
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        {[
                            { title: 'Inclusivity', description: 'Leagues for everyone — women, kids, beginners, seniors. Sport should be accessible to all.', color: '#1B5E20' },
                            { title: 'Fair Play', description: 'Handicap-based matching ensures competitive but fair games. Everyone has a chance to win.', color: '#1565C0' },
                            { title: 'Community', description: 'Sport is better with friends. Our group chats and social features help you build lasting connections.', color: '#FF6F00' },
                            { title: 'Transparency', description: 'Clear pricing, automatic refunds, and no hidden fees. You always know what you\'re paying for.', color: '#6A1B9A' },
                        ].map((value) => (
                            <Grid item xs={12} sm={6} md={3} key={value.title}>
                                <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid #E0E0E0' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ width: 8, height: 40, bgcolor: value.color, borderRadius: 1, mb: 2 }} />
                                        <Typography variant="h6" fontWeight={600} gutterBottom>{value.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{value.description}</Typography>
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
