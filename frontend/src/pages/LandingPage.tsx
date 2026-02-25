import { Box, Button, Card, CardContent, CardMedia, Container, Grid, Typography, Chip } from '@mui/material';
import {
    EmojiEvents, Groups, Chat, Leaderboard,
    Notifications, Payment, ArrowForward, CheckCircle, Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const features = [
    {
        icon: <EmojiEvents sx={{ fontSize: 48, color: '#FF6F00' }} />,
        title: 'Join Local Leagues',
        description: 'Find and join leagues near you. Categories for everyone — open, women, kids, beginners, seniors, and more.',
    },
    {
        icon: <Groups sx={{ fontSize: 48, color: '#1B5E20' }} />,
        title: 'Auto-Matched by Ability',
        description: 'Our smart algorithm groups you with players of similar handicap. Up to 8 players per match, sorted by skill level.',
    },
    {
        icon: <Chat sx={{ fontSize: 48, color: '#1565C0' }} />,
        title: 'Real-time Group Chat',
        description: 'Automatically added to group chats when matches are scheduled. Coordinate, reschedule, and chat with your group.',
    },
    {
        icon: <Leaderboard sx={{ fontSize: 48, color: '#6A1B9A' }} />,
        title: 'Track Your Scores',
        description: 'Record scores hole-by-hole, track your handicap officially, and climb the league leaderboard.',
    },
    {
        icon: <Notifications sx={{ fontSize: 48, color: '#E65100' }} />,
        title: 'Never Miss a Round',
        description: 'Get notified via push, SMS, or email when rounds open, matches are scheduled, or players reschedule.',
    },
    {
        icon: <Payment sx={{ fontSize: 48, color: '#00695C' }} />,
        title: 'Secure Payments',
        description: 'Pay to join rounds with automatic refunds if not enough players sign up. Powered by Stripe.',
    },
];

const sports = [
    {
        name: 'Golf',
        emoji: '⛳',
        description: 'Track handicaps, record hole-by-hole scores, and get matched with players at your level.',
        image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=400&fit=crop',
        color: '#1B5E20',
    },
    {
        name: 'Football',
        emoji: '⚽',
        description: 'Join 5-a-side, 7-a-side, or 11-a-side leagues. Find games near you every week.',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
        color: '#1565C0',
    },
    {
        name: 'Basketball',
        emoji: '🏀',
        description: 'Pick-up games and organised leagues. Track your stats and climb the rankings.',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
        color: '#E65100',
    },
    {
        name: 'Cricket',
        emoji: '🏏',
        description: 'T20, ODI, and test match formats. Join local cricket clubs and track your batting and bowling stats.',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop',
        color: '#6A1B9A',
    },
];

const steps = [
    { number: '01', title: 'Join a League', description: 'Browse local leagues by sport, category, and location. Join with one tap.', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop' },
    { number: '02', title: 'Sign Up for Rounds', description: 'Pay the entry fee and register for upcoming rounds before the deadline.', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop' },
    { number: '03', title: 'Get Matched', description: 'When the round starts, you\'re automatically grouped with players of similar ability.', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop' },
    { number: '04', title: 'Play & Track', description: 'Play your match, record scores, and watch your ranking improve over time.', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400&h=300&fit=crop' },
];

const testimonials = [
    { name: 'James W.', role: 'Golf Enthusiast', text: 'Finally an app that makes it easy to find people to play with. The handicap matching is brilliant!', rating: 5 },
    { name: 'Sarah M.', role: 'League Organiser', text: 'Managing our women\'s golf society has never been easier. The auto-scheduling saves hours of work.', rating: 5 },
    { name: 'David K.', role: 'Weekend Golfer', text: 'Love the group chat feature. We always end up rearranging tee times and it\'s so easy now.', rating: 5 },
];

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 30%, #388E3C 60%, #43A047 100%)',
                    color: 'white',
                    pt: { xs: 12, md: 16 },
                    pb: { xs: 10, md: 14 },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    },
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Chip
                                label="🏌️ ⚽ 🏀 🏏 Golf • Football • Basketball • Cricket"
                                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', mb: 3, fontWeight: 500, fontSize: '0.85rem' }}
                            />
                            <Typography
                                variant="h2"
                                fontWeight={800}
                                sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.1, mb: 3 }}
                            >
                                Play More Sport.{' '}
                                <Box component="span" sx={{ color: '#FFD54F' }}>
                                    Meet New Players.
                                </Box>{' '}
                                Track Your Game.
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ opacity: 0.9, mb: 4, fontWeight: 400, maxWidth: 550, lineHeight: 1.6 }}
                            >
                                Join local leagues, get automatically matched with players your level,
                                and track your scores officially — all in one app.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate(ROUTES.REGISTER)}
                                    sx={{
                                        bgcolor: 'white', color: '#1B5E20',
                                        px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 700,
                                        '&:hover': { bgcolor: '#F5F5F5', transform: 'translateY(-2px)' },
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                    }}
                                    endIcon={<ArrowForward />}
                                >
                                    Get Started Free
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/features')}
                                    sx={{
                                        borderColor: 'rgba(255,255,255,0.5)', color: 'white',
                                        px: 4, py: 1.5, fontSize: '1.1rem',
                                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                                    }}
                                >
                                    Learn More
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3, mt: 4, opacity: 0.8 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CheckCircle sx={{ fontSize: 18 }} /> <Typography variant="body2">Free to join</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CheckCircle sx={{ fontSize: 18 }} /> <Typography variant="body2">Auto-refunds</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CheckCircle sx={{ fontSize: 18 }} /> <Typography variant="body2">Official handicaps</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box
                                component="img"
                                src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&h=500&fit=crop"
                                alt="Golfers on course"
                                sx={{
                                    width: '100%',
                                    borderRadius: 4,
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Sports Section */}
            <Box sx={{ py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" fontWeight={700} gutterBottom>
                            Sports You Can Play
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Join leagues across multiple sports. Each with tailored scoring, rankings, and match formats.
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {sports.map((sport) => (
                            <Grid item xs={12} sm={6} md={3} key={sport.name}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s',
                                        '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 16px 40px rgba(0,0,0,0.15)' },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={sport.image}
                                        alt={sport.name}
                                    />
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h5" fontWeight={700} gutterBottom>
                                            {sport.emoji} {sport.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                                            {sport.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FAFAFA' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" fontWeight={700} gutterBottom>
                            Everything You Need to Play
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            From finding leagues to tracking your handicap, we've got every aspect of your sporting life covered.
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {features.map((feature) => (
                            <Grid item xs={12} sm={6} md={4} key={feature.title}>
                                <Card
                                    sx={{
                                        height: '100%', border: '1px solid #E0E0E0', boxShadow: 'none',
                                        transition: 'all 0.3s',
                                        '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(0,0,0,0.1)', borderColor: 'transparent' },
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>{feature.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{feature.description}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* How It Works */}
            <Box sx={{ py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" fontWeight={700} gutterBottom>How It Works</Typography>
                        <Typography variant="h6" color="text.secondary">Get playing in 4 simple steps</Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {steps.map((step) => (
                            <Grid item xs={12} sm={6} md={3} key={step.number}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box
                                        component="img"
                                        src={step.image}
                                        alt={step.title}
                                        sx={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 3, mb: 2 }}
                                    />
                                    <Typography
                                        variant="h2" fontWeight={800}
                                        sx={{ background: 'linear-gradient(135deg, #1B5E20, #43A047)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}
                                    >
                                        {step.number}
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>{step.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{step.description}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Social Proof Image Banner */}
            <Box
                sx={{
                    py: 0,
                    position: 'relative',
                    height: { xs: 200, md: 300 },
                    overflow: 'hidden',
                }}
            >
                <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1400&h=400&fit=crop"
                    alt="People playing sport together"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box
                    sx={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(to right, rgba(27,94,32,0.8), rgba(27,94,32,0.4))',
                        display: 'flex', alignItems: 'center',
                    }}
                >
                    <Container maxWidth="lg">
                        <Typography variant="h4" fontWeight={700} color="white" sx={{ maxWidth: 500 }}>
                            Sport brings people together. We make it easier to find your game.
                        </Typography>
                    </Container>
                </Box>
            </Box>

            {/* Testimonials */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F5F5F5' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" fontWeight={700} gutterBottom>What Players Say</Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {testimonials.map((t) => (
                            <Grid item xs={12} md={4} key={t.name}>
                                <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                                            {Array.from({ length: t.rating }).map((_, i) => (
                                                <Star key={i} sx={{ color: '#FFB300', fontSize: 20 }} />
                                            ))}
                                        </Box>
                                        <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', lineHeight: 1.7 }}>
                                            &ldquo;{t.text}&rdquo;
                                        </Typography>
                                        <Typography variant="subtitle2" fontWeight={600}>{t.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{t.role}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                    color: 'white', textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight={700} gutterBottom>Ready to Play?</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                        Join players across Golf, Football, Basketball, and Cricket. Create your free account and find your next game.
                    </Typography>
                    <Button
                        variant="contained" size="large"
                        onClick={() => navigate(ROUTES.REGISTER)}
                        sx={{
                            bgcolor: 'white', color: '#1B5E20',
                            px: 6, py: 2, fontSize: '1.2rem', fontWeight: 700,
                            '&:hover': { bgcolor: '#F5F5F5', transform: 'translateY(-2px)' },
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        }}
                        endIcon={<ArrowForward />}
                    >
                        Create Your Free Account
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}
