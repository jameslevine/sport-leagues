import {
    Box, Card, CardContent, Grid, Typography, CircularProgress, Alert,
    List, ListItem, ListItemText, Chip, Avatar, Button, Paper,
} from '@mui/material';
import {
    EmojiEvents, Group, SportsGolf, CalendarMonth, TrendingUp,
    ArrowForward, Search as SearchIcon,
} from '@mui/icons-material';
import { useDashboard } from '../hooks/useDashboard';
import { useProfile } from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GRADIENTS } from '../constants/images';
import dayjs from 'dayjs';

const STAT_CONFIGS = [
    { key: 'leagueCount', label: 'dashboard.myLeagues', icon: EmojiEvents, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', iconBg: 'rgba(255,255,255,0.2)' },
    { key: 'upcomingMatchCount', label: 'dashboard.upcomingMatches', icon: CalendarMonth, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', iconBg: 'rgba(255,255,255,0.2)' },
    { key: 'followingCount', label: 'dashboard.following', icon: Group, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', iconBg: 'rgba(255,255,255,0.2)' },
    { key: 'roundsPlayed', label: 'dashboard.roundsPlayed', icon: SportsGolf, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', iconBg: 'rgba(255,255,255,0.2)' },
];

export default function DashboardPage() {
    const { data: stats, isLoading, error } = useDashboard();
    const { data: profile } = useProfile();
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={48} />
            </Box>
        );
    }

    const firstName = (profile as any)?.firstName || 'there';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <Box>
            {/* Welcome Banner */}
            <Paper
                sx={{
                    mb: 4,
                    p: 4,
                    borderRadius: 3,
                    background: GRADIENTS.cool,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                elevation={0}
            >
                <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
                    <TrendingUp sx={{ fontSize: 200 }} />
                </Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    {greeting}, {firstName}! 👋
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.85, mb: 2, maxWidth: 500 }}>
                    Track your leagues, upcoming matches, and connect with fellow players.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={() => navigate('/app/leagues')}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                            textTransform: 'none',
                            borderRadius: 2,
                        }}
                    >
                        Find Leagues
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<CalendarMonth />}
                        onClick={() => navigate('/app/matches')}
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.4)',
                            '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                            textTransform: 'none',
                            borderRadius: 2,
                        }}
                    >
                        My Matches
                    </Button>
                </Box>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {t('dashboard.failedToLoad')}
                </Alert>
            )}

            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {STAT_CONFIGS.map((config) => {
                    const Icon = config.icon;
                    const value = (stats as any)?.[config.key] ?? 0;
                    return (
                        <Grid item xs={6} md={3} key={config.key}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    background: config.gradient,
                                    color: 'white',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                                    },
                                }}
                                elevation={0}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h3" fontWeight={800}>
                                                {value}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                                                {t(config.label)}
                                            </Typography>
                                        </Box>
                                        <Avatar sx={{ bgcolor: config.iconBg, width: 48, height: 48 }}>
                                            <Icon />
                                        </Avatar>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Upcoming Matches */}
            {stats?.upcomingMatches && stats.upcomingMatches.length > 0 && (
                <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }} elevation={0}>
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight={600}>
                            {t('dashboard.upcomingMatches')}
                        </Typography>
                        <Button
                            size="small"
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/app/matches')}
                            sx={{ textTransform: 'none' }}
                        >
                            View All
                        </Button>
                    </Box>
                    <List disablePadding>
                        {stats.upcomingMatches.map((match, i) => (
                            <ListItem
                                key={match.matchId}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.hover' },
                                    borderBottom: i < stats.upcomingMatches.length - 1 ? '1px solid' : 'none',
                                    borderColor: 'divider',
                                    py: 2,
                                }}
                                onClick={() => navigate(`/app/matches/${match.matchId}`)}
                            >
                                <Avatar sx={{ bgcolor: 'primary.light', mr: 2, width: 44, height: 44 }}>
                                    <CalendarMonth />
                                </Avatar>
                                <ListItemText
                                    primary={
                                        <Typography fontWeight={600}>
                                            {t('matches.group')} {match.groupNumber}
                                        </Typography>
                                    }
                                    secondary={`${dayjs(match.scheduledDate).format('ddd, MMM D')} at ${match.scheduledTime || 'TBD'}`}
                                />
                                <Chip
                                    label={t(`matches.status.${match.status}`)}
                                    size="small"
                                    color={match.status === 'SCHEDULED' ? 'primary' : 'warning'}
                                    sx={{ borderRadius: 2 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            )}

            {/* Empty State */}
            {stats?.leagueCount === 0 && (
                <Paper
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 3,
                        border: '2px dashed',
                        borderColor: 'divider',
                        bgcolor: 'transparent',
                    }}
                    elevation={0}
                >
                    <EmojiEvents sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No leagues yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {t('dashboard.noLeagues')}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/app/leagues')}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Browse Leagues
                    </Button>
                </Paper>
            )}
        </Box>
    );
}
