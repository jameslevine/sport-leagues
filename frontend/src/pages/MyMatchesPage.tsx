import {
    Box, Typography, Card, CardContent, Chip, CircularProgress, Alert,
    Avatar, AvatarGroup, Tabs, Tab, Paper,
} from '@mui/material';
import { CalendarMonth, LocationOn, Group } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useAppStore } from '../store';
import { apiClient } from '../services/apiClient';
import { useQuery } from '@tanstack/react-query';

interface Match {
    matchId: string;
    roundId: string;
    leagueId: string;
    sportType: string;
    players: string[];
    groupNumber: number;
    scheduledDate: string;
    scheduledTime: string;
    venue: { name: string; address: string };
    status: string;
    groupChatId?: string;
    playersWithDetails?: { userId: string; displayName: string; firstName: string; lastName: string; avatarUrl?: string }[];
}

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    SCHEDULED: 'info',
    RESCHEDULED: 'warning',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
    CANCELLED: 'error',
};

export default function MyMatchesPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const sport = useAppStore((s) => s.selectedSport).toLowerCase();
    const [tab, setTab] = useState(0);

    const { data, isLoading, error } = useQuery({
        queryKey: ['myMatches', sport],
        queryFn: async () => {
            const res = await apiClient.get<{ matches: Match[] }>(`/${sport}/matches/me`);
            return res.matches ?? [];
        },
    });

    const now = dayjs();
    const upcoming = (data || []).filter(
        (m) => (m.status === 'SCHEDULED' || m.status === 'RESCHEDULED') && dayjs(m.scheduledDate).isAfter(now),
    );
    const past = (data || []).filter(
        (m) => m.status === 'COMPLETED' || m.status === 'CANCELLED' || dayjs(m.scheduledDate).isBefore(now),
    );

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={48} />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                {t('matches.title')}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    Failed to load matches.
                </Alert>
            )}

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{ mb: 3 }}
            >
                <Tab label={`Upcoming (${upcoming.length})`} icon={<CalendarMonth />} iconPosition="start" />
                <Tab label={`Past (${past.length})`} iconPosition="start" />
            </Tabs>

            {tab === 0 && (
                <Box>
                    {upcoming.length === 0 && (
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
                            <CalendarMonth sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No upcoming matches
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Join a league and register for rounds to get matched with other players.
                            </Typography>
                        </Paper>
                    )}
                    {upcoming.map((match) => (
                        <MatchCard key={match.matchId} match={match} onClick={() => navigate(`/app/matches/${match.matchId}`)} />
                    ))}
                </Box>
            )}

            {tab === 1 && (
                <Box>
                    {past.length === 0 && (
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
                            <Typography variant="h6" color="text.secondary">
                                No past matches yet
                            </Typography>
                        </Paper>
                    )}
                    {past.map((match) => (
                        <MatchCard key={match.matchId} match={match} onClick={() => navigate(`/app/matches/${match.matchId}`)} />
                    ))}
                </Box>
            )}
        </Box>
    );
}

function MatchCard({ match, onClick }: { match: Match; onClick: () => void }) {
    const { t } = useTranslation();
    const isUpcoming = dayjs(match.scheduledDate).isAfter(dayjs());
    const daysUntil = dayjs(match.scheduledDate).diff(dayjs(), 'day');

    return (
        <Card
            sx={{
                mb: 2,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                },
                borderLeft: '4px solid',
                borderColor: isUpcoming ? 'primary.main' : 'grey.300',
            }}
            onClick={onClick}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            {t('matches.group')} {match.groupNumber}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {dayjs(match.scheduledDate).format('dddd, MMMM D, YYYY')} at {match.scheduledTime || 'TBD'}
                            </Typography>
                        </Box>
                        {match.venue && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {match.venue.name}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Chip
                            label={t(`matches.status.${match.status}`, match.status)}
                            size="small"
                            color={STATUS_COLORS[match.status] || 'default'}
                            sx={{ borderRadius: 2 }}
                        />
                        {isUpcoming && daysUntil >= 0 && (
                            <Typography variant="caption" color="primary" fontWeight={600}>
                                {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Group sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {match.players.length} players
                    </Typography>
                    <AvatarGroup max={4} sx={{ ml: 1 }}>
                        {match.players.map((playerId) => (
                            <Avatar key={playerId} sx={{ width: 28, height: 28, fontSize: 12 }}>
                                {playerId.charAt(0).toUpperCase()}
                            </Avatar>
                        ))}
                    </AvatarGroup>
                </Box>
            </CardContent>
        </Card>
    );
}
