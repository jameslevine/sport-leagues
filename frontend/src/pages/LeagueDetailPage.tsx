import { Box, Typography, Tabs, Tab, Button, Chip } from '@mui/material';
import { useState } from 'react';

export default function LeagueDetailPage() {
    const [tab, setTab] = useState(0);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="h4">City Golf League</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip label="OPEN" color="primary" />
                        <Chip label="London" variant="outlined" />
                        <Chip label="45/100 members" variant="outlined" />
                    </Box>
                </Box>
                <Button variant="contained">Join League</Button>
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Rounds" />
                <Tab label="Members" />
                <Tab label="Leaderboard" />
                <Tab label="Chat" />
            </Tabs>
            {tab === 0 && <Typography>Upcoming rounds will be displayed here</Typography>}
            {tab === 1 && <Typography>League members will be displayed here</Typography>}
            {tab === 2 && <Typography>Leaderboard will be displayed here</Typography>}
            {tab === 3 && <Typography>League chat will be displayed here</Typography>}
        </Box>
    );
}
