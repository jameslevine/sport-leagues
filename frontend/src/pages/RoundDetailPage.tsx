import { Box, Typography, Button, Card, CardContent, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

export default function RoundDetailPage() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Round Details</Typography>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Saturday Morning Round</Typography>
                    <Typography color="text.secondary">March 15, 2026 - 8:00 AM</Typography>
                    <Typography color="text.secondary">Royal Links Golf Course</Typography>
                    <Typography sx={{ mt: 1 }}>Entry Fee: £15.00</Typography>
                    <Typography>Players: 3/4 (min 2)</Typography>
                    <Button variant="contained" sx={{ mt: 2 }}>Join Round - £15.00</Button>
                </CardContent>
            </Card>
            <Typography variant="h6" gutterBottom>Participants</Typography>
            <List>
                <ListItem>
                    <ListItemAvatar><Avatar>J</Avatar></ListItemAvatar>
                    <ListItemText primary="John Smith" secondary="Handicap: 12.4" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar><Avatar>S</Avatar></ListItemAvatar>
                    <ListItemText primary="Sarah Jones" secondary="Handicap: 8.2" />
                </ListItem>
            </List>
        </Box>
    );
}
