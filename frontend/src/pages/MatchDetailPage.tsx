import { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Button, List, ListItem,
    ListItemAvatar, ListItemText, Avatar, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField,
} from '@mui/material';
import { Schedule, Group, Chat, Edit } from '@mui/icons-material';

export default function MatchDetailPage() {
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    // TODO: Replace with actual data from useMatch hook
    const mockMatch = {
        matchId: '1',
        groupNumber: 1,
        scheduledDate: '2026-03-15',
        scheduledTime: '08:00',
        venue: { name: 'Royal Links Golf Course' },
        status: 'SCHEDULED',
        players: [
            { userId: '1', displayName: 'John Smith', handicap: 12.4 },
            { userId: '2', displayName: 'Sarah Jones', handicap: 8.2 },
            { userId: '3', displayName: 'Mike Brown', handicap: 15.1 },
            { userId: '4', displayName: 'Emma Wilson', handicap: 10.8 },
        ],
    };

    const handleReschedule = () => {
        // TODO: Call API to reschedule match
        setRescheduleOpen(false);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Match - Group {mockMatch.groupNumber}</Typography>
                <Chip
                    label={mockMatch.status}
                    color={mockMatch.status === 'SCHEDULED' ? 'primary' : 'default'}
                />
            </Box>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Schedule color="action" />
                        <Typography>{mockMatch.scheduledDate} at {mockMatch.scheduledTime}</Typography>
                    </Box>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        {mockMatch.venue.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={() => setRescheduleOpen(true)}
                        >
                            Reschedule
                        </Button>
                        <Button variant="outlined" startIcon={<Chat />}>
                            Open Group Chat
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Group /> Players ({mockMatch.players.length})
            </Typography>
            <List>
                {mockMatch.players.map((player) => (
                    <ListItem key={player.userId}>
                        <ListItemAvatar>
                            <Avatar>{player.displayName[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={player.displayName}
                            secondary={`Handicap: ${player.handicap}`}
                        />
                    </ListItem>
                ))}
            </List>

            <Dialog open={rescheduleOpen} onClose={() => setRescheduleOpen(false)}>
                <DialogTitle>Reschedule Match</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        All players will be notified of the new date and time.
                    </Typography>
                    <TextField
                        label="New Date"
                        type="date"
                        fullWidth
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="New Time"
                        type="time"
                        fullWidth
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRescheduleOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleReschedule}>
                        Reschedule
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
