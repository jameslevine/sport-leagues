import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Button, Chip, Card, CardContent, CircularProgress, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import { CalendarMonth, Group, Payment } from '@mui/icons-material';
import { useLeague, useLeagueMembers, useJoinLeague, useLeaveLeague } from '../hooks/useLeagues';
import { useLeagueRounds, useJoinRound, useRoundParticipants } from '../hooks/useRounds';
import { useAuthStore } from '../store';
import { PaymentDialog } from '../components/PaymentForm';

export default function LeagueDetailPage() {
    const { leagueId } = useParams<{ leagueId: string }>();
    const [tab, setTab] = useState(0);
    const { data: league, isLoading: leagueLoading } = useLeague(leagueId || '');
    const { data: rounds, isLoading: roundsLoading } = useLeagueRounds(leagueId || '');
    const { data: membersData } = useLeagueMembers(leagueId || '');
    const joinLeague = useJoinLeague(leagueId || '');
    const leaveLeague = useLeaveLeague(leagueId || '');
    const currentUser = useAuthStore((s) => s.user);

    if (leagueLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>;
    }

    if (!league) {
        return <Alert severity="error">League not found</Alert>;
    }

    const members = (membersData as any)?.members || [];
    const isMember = members.some((m: any) => m.userId === currentUser?.userId);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>{league.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip label={league.category} color="primary" />
                        <Chip label={(league as any).region} variant="outlined" />
                        <Chip label={`${league.memberCount} members`} variant="outlined" />
                        <Chip label={`£${(league.entryFee / 100).toFixed(2)} per round`} variant="outlined" icon={<Payment />} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {(league as any).description}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {isMember ? (
                        <>
                            <Chip label="Member ✓" color="success" variant="outlined" />
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => leaveLeague.mutate()}
                                disabled={leaveLeague.isPending}
                            >
                                {leaveLeague.isPending ? 'Leaving...' : 'Leave League'}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => joinLeague.mutate()}
                            disabled={joinLeague.isPending}
                        >
                            {joinLeague.isPending ? 'Joining...' : 'Join League'}
                        </Button>
                    )}
                </Box>
            </Box>

            {joinLeague.isSuccess && <Alert severity="success" sx={{ mb: 2 }}>You've joined the league!</Alert>}
            {joinLeague.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to join. You may already be a member.</Alert>}
            {leaveLeague.isSuccess && <Alert severity="info" sx={{ mb: 2 }}>You've left the league.</Alert>}

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label={`Rounds (${rounds?.length || 0})`} icon={<CalendarMonth />} iconPosition="start" />
                <Tab label={`Members (${members.length})`} icon={<Group />} iconPosition="start" />
            </Tabs>

            {tab === 0 && (
                <Box>
                    {roundsLoading && <CircularProgress />}
                    {rounds && rounds.length === 0 && <Alert severity="info">No upcoming rounds for this league.</Alert>}
                    {(rounds || []).map((round) => (
                        <RoundCard key={round.roundId} round={round} />
                    ))}
                </Box>
            )}

            {tab === 1 && (
                <Box>
                    {members.length === 0 && <Alert severity="info">No members yet. Be the first to join!</Alert>}
                    <List>
                        {members.map((member: any, i: number) => (
                            <Box key={member.userId || i}>
                                <ListItem>
                                    <ListItemText
                                        primary={member.userId === currentUser?.userId ? 'You' : (member.user?.displayName || member.user?.firstName ? `${member.user?.firstName} ${member.user?.lastName}` : 'Member')}
                                        secondary={`Joined: ${member.joinedAt?.split('T')[0] || 'Unknown'} • Role: ${member.role}`}
                                    />
                                </ListItem>
                                {i < members.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
}

function RoundCard({ round }: { round: any }) {
    const joinRound = useJoinRound(round.roundId);
    const { data: participants } = useRoundParticipants(round.roundId);
    const currentUser = useAuthStore((s) => s.user);
    const isPast = new Date(round.registrationDeadline) < new Date();
    const isFull = round.currentPlayers >= round.maxPlayers;

    const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
    const [showPayment, setShowPayment] = useState(false);

    const isParticipant = participants?.some(
        (p: any) => p.userId === currentUser?.userId && p.status !== 'CANCELLED',
    );

    const canJoin = round.status === 'OPEN' && !isPast && !isFull && !isParticipant;

    const handleJoin = async () => {
        try {
            const result = await joinRound.mutateAsync();
            if (result.clientSecret) {
                setPaymentClientSecret(result.clientSecret);
                setShowPayment(true);
            }
        } catch (err) {
            // Error handled by mutation state
        }
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            {round.scheduledDate} at {round.scheduledTime}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {round.venue?.name} • {round.venue?.address}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip label={round.status} size="small" color={round.status === 'OPEN' ? 'success' : 'default'} />
                            <Chip label={`${round.currentPlayers}/${round.maxPlayers} players`} size="small" variant="outlined" />
                            <Chip label={`Min ${round.minPlayers} needed`} size="small" variant="outlined" />
                            <Chip label={`£${(round.entryFee / 100).toFixed(2)}`} size="small" variant="outlined" />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Registration deadline: {round.registrationDeadline}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {isParticipant && (
                            <Chip label="Joined ✓" color="success" variant="outlined" />
                        )}
                        {canJoin && (
                            <Button
                                variant="contained"
                                onClick={handleJoin}
                                disabled={joinRound.isPending}
                            >
                                {joinRound.isPending ? 'Joining...' : `Join Round - £${(round.entryFee / 100).toFixed(2)}`}
                            </Button>
                        )}
                        {isPast && !isParticipant && <Chip label="Registration closed" color="warning" />}
                        {isFull && !isParticipant && <Chip label="Full" color="error" />}
                    </Box>
                </Box>
                {joinRound.isSuccess && !showPayment && <Alert severity="success" sx={{ mt: 1 }}>Registered! Payment will be processed.</Alert>}
                {joinRound.isError && <Alert severity="error" sx={{ mt: 1 }}>Failed to join round.</Alert>}
            </CardContent>

            <PaymentDialog
                open={showPayment}
                clientSecret={paymentClientSecret}
                amount={round.entryFee}
                title={`Pay Entry Fee - ${round.venue?.name || 'Round'}`}
                onSuccess={() => {
                    setShowPayment(false);
                    setPaymentClientSecret(null);
                }}
                onClose={() => {
                    setShowPayment(false);
                    setPaymentClientSecret(null);
                }}
            />
        </Card>
    );
}
