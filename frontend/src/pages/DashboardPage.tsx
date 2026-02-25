import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { EmojiEvents, Group, SportsGolf, CalendarMonth } from '@mui/icons-material';

export default function DashboardPage() {
    const stats = [
        { label: 'My Leagues', value: '3', icon: <EmojiEvents color="primary" /> },
        { label: 'Upcoming Rounds', value: '2', icon: <CalendarMonth color="secondary" /> },
        { label: 'Following', value: '15', icon: <Group color="primary" /> },
        { label: 'Rounds Played', value: '24', icon: <SportsGolf color="secondary" /> },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                {stats.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                        <Card>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {stat.icon}
                                <Box>
                                    <Typography variant="h4">{stat.value}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
