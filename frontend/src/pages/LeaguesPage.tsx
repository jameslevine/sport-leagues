import { Box, Card, CardContent, CardMedia, Chip, Grid, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useLeagues } from '../hooks/useLeagues';
import { useNavigate } from 'react-router-dom';

export default function LeaguesPage() {
    const { data: leagues, isLoading, error } = useLeagues();
    const navigate = useNavigate();

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Leagues</Typography>
                <Button variant="contained" startIcon={<Add />}>
                    Create League
                </Button>
            </Box>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load leagues. Please try again.
                </Alert>
            )}

            {leagues && leagues.length === 0 && !isLoading && (
                <Alert severity="info">
                    No leagues found. Create one to get started!
                </Alert>
            )}

            <Grid container spacing={3}>
                {(leagues || []).map((league) => (
                    <Grid item xs={12} sm={6} md={4} key={league.leagueId}>
                        <Card
                            sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: '0.2s' } }}
                            onClick={() => navigate(`/leagues/${league.leagueId}`)}
                        >
                            <CardMedia
                                component="div"
                                sx={{ height: 140, bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Typography variant="h5" color="white">{league.sportType}</Typography>
                            </CardMedia>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{league.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                    <Chip label={league.category} size="small" color="primary" variant="outlined" />
                                    <Chip label={league.region} size="small" variant="outlined" />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {league.memberCount}/{league.maxMembers} members
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
