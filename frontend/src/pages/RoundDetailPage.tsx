import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useRound, useRoundParticipants, useJoinRound, useLeaveRound } from '../hooks/useRounds';
import { useAuthStore } from '../store';
import { useTranslation } from 'react-i18next';
import { PaymentDialog } from '../components/PaymentForm';
import dayjs from 'dayjs';

export default function RoundDetailPage() {
    const { roundId } = useParams<{ roundId: string }>();
    const { data: round, isLoading, error } = useRound(roundId || '');
    const { data: participants } = useRoundParticipants(roundId || '');
    const joinRound = useJoinRound(roundId || '');
    const leaveRound = useLeaveRound(roundId || '');
    const currentUser = useAuthStore((s) => s.user);
    const { t } = useTranslation();

    const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
    const [showPayment, setShowPayment] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    // Check if current user is already a participant
    const isParticipant = participants?.some(
        (p) => p.userId === currentUser?.userId && p.status !== 'CANCELLED',
    );

    const isOpen = round?.status === 'OPEN';
    const isFull = round?.status === 'FULL';
    const isPastDeadline = round?.registrationDeadline
        ? dayjs().isAfter(dayjs(round.registrationDeadline))
        : false;

    const canJoin = isOpen && !isParticipant && !isPastDeadline;
    const canLeave = isParticipant && (isOpen || isFull);

    const handleJoin = async () => {
        setActionError(null);
        try {
            const result = await joinRound.mutateAsync();
            if (result.clientSecret) {
                setPaymentClientSecret(result.clientSecret);
                setShowPayment(true);
            }
        } catch (err: any) {
            setActionError(err?.message || 'Failed to join round');
        }
    };

    const handleLeave = async () => {
        setActionError(null);
        try {
            await leaveRound.mutateAsync();
        } catch (err: any) {
            setActionError(err?.message || 'Failed to leave round');
        }
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setPaymentClientSecret(null);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !round) {
        return (
            <Alert severity="error">
                {t('common.error')}
            </Alert>
        );
    }

    const statusColor: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
        OPEN: 'success',
        FULL: 'warning',
        IN_PROGRESS: 'info',
        COMPLETED: 'default',
        CANCELLED: 'error',
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>{t('rounds.title')}</Typography>

            {actionError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {actionError}
                </Alert>
            )}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography variant="h6">
                                {round.venue?.name || 'Round'}
                            </Typography>
                            <Typography color="text.secondary">
                                {dayjs(round.scheduledDate).format('dddd, MMMM D, YYYY')} - {round.scheduledTime}
                            </Typography>
                            <Typography color="text.secondary">
                                {round.venue?.address}
                            </Typography>
                        </Box>
                        <Chip
                            label={t(`rounds.status.${round.status}`, round.status)}
                            color={statusColor[round.status] || 'default'}
                        />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">{t('rounds.entryFee')}</Typography>
                            <Typography variant="h6">£{(round.entryFee / 100).toFixed(2)}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">{t('rounds.players')}</Typography>
                            <Typography variant="h6">
                                {round.currentPlayers}/{round.maxPlayers}
                                <Typography component="span" variant="body2" color="text.secondary">
                                    {' '}(min {round.minPlayers})
                                </Typography>
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">{t('rounds.registrationDeadline')}</Typography>
                            <Typography variant="h6">
                                {dayjs(round.registrationDeadline).format('MMM D, HH:mm')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        {canJoin && (
                            <Button
                                variant="contained"
                                onClick={handleJoin}
                                disabled={joinRound.isPending}
                            >
                                {joinRound.isPending ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    `${t('rounds.joinRound')} - £${(round.entryFee / 100).toFixed(2)}`
                                )}
                            </Button>
                        )}

                        {canLeave && (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleLeave}
                                disabled={leaveRound.isPending}
                            >
                                {leaveRound.isPending ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    t('rounds.leaveRound')
                                )}
                            </Button>
                        )}

                        {isParticipant && (
                            <Chip label="You're registered" color="success" variant="outlined" />
                        )}

                        {isPastDeadline && !isParticipant && (
                            <Typography color="text.secondary">
                                Registration closed
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="h6" gutterBottom>
                Participants ({participants?.length || 0})
            </Typography>

            {(!participants || participants.length === 0) && (
                <Alert severity="info">No participants yet. Be the first to join!</Alert>
            )}

            <List>
                {(participants || [])
                    .filter((p) => p.status !== 'CANCELLED')
                    .map((participant) => (
                        <ListItem key={participant.userId}>
                            <ListItemAvatar>
                                <Avatar>
                                    {participant.userId === currentUser?.userId ? 'You' : participant.userId.charAt(0).toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={participant.userId === currentUser?.userId ? 'You' : participant.userId.substring(0, 8) + '...'}
                                secondary={`Joined ${dayjs(participant.joinedAt).format('MMM D, HH:mm')} • ${participant.status}`}
                            />
                            <Chip
                                label={participant.paymentStatus}
                                size="small"
                                color={participant.paymentStatus === 'PAID' ? 'success' : 'warning'}
                                variant="outlined"
                            />
                        </ListItem>
                    ))}
            </List>

            <PaymentDialog
                open={showPayment}
                clientSecret={paymentClientSecret}
                amount={round.entryFee}
                title={`Pay Entry Fee - ${round.venue?.name || 'Round'}`}
                onSuccess={handlePaymentSuccess}
                onClose={() => setShowPayment(false)}
            />
        </Box>
    );
}
