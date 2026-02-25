import { Box, Container, Typography, Card, CardContent, CardMedia, Grid, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const sports = [
    { name: 'Golf', emoji: '⛳', path: '/scoring-rules/golf', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=300&fit=crop', color: '#1B5E20', format: 'Stableford Points • 18 Holes • Handicap Matching' },
    { name: 'Football', emoji: '⚽', path: '/scoring-rules/football', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=300&fit=crop', color: '#1565C0', format: '5-a-side • 40 Minutes • Individual Points' },
    { name: 'Basketball', emoji: '🏀', path: '/scoring-rules/basketball', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=300&fit=crop', color: '#E65100', format: '3v3 Half-Court • 15 Min or First to 21 • FIBA 3x3 Rules' },
    { name: 'Cricket', emoji: '🏏', path: '/scoring-rules/cricket', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=300&fit=crop', color: '#6A1B9A', format: 'T10 • 8-a-side • 90 Minutes • Fantasy Points' },
];

export default function ScoringRulesPage() {
    const navigate = useNavigate();

    return (
        <Box>
            <Box sx={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', color: 'white', pt: 14, pb: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight={800} gutterBottom>Scoring Rules</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                        We're opinionated about how each sport is played on Sport Leagues. Clear rules mean fair games for everyone. Choose a sport to see the full rules.
                    </Typography>
                </Container>
            </Box>
            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {sports.map((sport) => (
                            <Grid item xs={12} md={6} key={sport.name}>
                                <Card
                                    sx={{
                                        cursor: 'pointer', overflow: 'hidden',
                                        transition: 'all 0.3s',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' },
                                    }}
                                    onClick={() => navigate(sport.path)}
                                >
                                    <CardMedia component="img" height="200" image={sport.image} alt={sport.name} />
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h4" fontWeight={700} gutterBottom>
                                            {sport.emoji} {sport.name}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                            {sport.format}
                                        </Typography>
                                        <Button variant="contained" endIcon={<ArrowForward />} sx={{ bgcolor: sport.color }}>
                                            View Full Rules
                                        </Button>
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
