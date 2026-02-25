import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from '@mui/material';

export default function MessagesPage() {
    const mockConversations = [
        { id: '1', name: 'City Golf League Chat', lastMessage: 'Great round today!', time: '2 min ago' },
        { id: '2', name: 'John Smith', lastMessage: 'See you Saturday?', time: '1 hour ago' },
        { id: '3', name: 'Sarah Jones', lastMessage: 'Thanks for the tips!', time: 'Yesterday' },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Messages</Typography>
            <List>
                {mockConversations.map((conv, index) => (
                    <Box key={conv.id}>
                        <ListItem sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                            <ListItemAvatar>
                                <Avatar>{conv.name[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={conv.name}
                                secondary={conv.lastMessage}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {conv.time}
                            </Typography>
                        </ListItem>
                        {index < mockConversations.length - 1 && <Divider />}
                    </Box>
                ))}
            </List>
        </Box>
    );
}
