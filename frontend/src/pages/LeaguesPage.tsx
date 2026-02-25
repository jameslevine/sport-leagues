import { Box, Card, CardContent, CardMedia, Chip, Grid, Typography, CircularProgress, Alert, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useLeagues } from '../hooks/useLeagues';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CATEGORIES = ['ALL', 'OPEN', 'WOMEN', 'BEGINNERS', 'SENIORS'];

export default function LeaguesPage() {
    const { data: leagues, isLoading, error } = useLeagues();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    const filteredLeagues = (leagues || []).filter((league) => {
        const matchesSearch = !searchText ||
            league.name.toLowerCase().includes(searchText.toLowerCase()) ||
            (league as any).region?.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || league.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Find Your League</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Browse leagues near you. Join a league to sign up for upcoming rounds and get matched with players at your level.
            </Typography>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Search by name or region..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="small"
                    sx={{ minWidth: 250 }}
                    InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
                        {CATEGORIES.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat.charAt(0) + cat.slice(1).toLowerCase()}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
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

            {filteredLeagues.length === 0 && !isLoading && !error && (
                <Alert severity="info">
                    {searchText || categoryFilter !== 'ALL'
                        ? 'No leagues match your filters. Try adjusting your search.'
                        : 'No leagues available yet. Check back soon!'}
                </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {filteredLeagues.length} league{filteredLeagues.length !== 1 ? 's' : ''} found
            </Typography>

            <Grid container spacing={3}>
                {filteredLeagues.map((league) => (
                    <Grid item xs={12} sm={6} md={4} key={league.leagueId}>
                        <Card
                            sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: '0.2s', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' } }}
                            onClick={() => navigate(`/app/leagues/${league.leagueId}`)}
                        >
                            <CardMedia
                                component="div"
                                sx={{ height: 100, bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Typography variant="h5" color="white">{league.sportType}</Typography>
                            </CardMedia>
                            <CardContent>
                                <Typography variant="h6" gutterBottom noWrap>{league.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                    <Chip label={league.category} size="small" color="primary" variant="outlined" />
                                    <Chip label={(league as any).region || ''} size="small" variant="outlined" />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {league.memberCount}/{league.maxMembers} members • £{(league.entryFee / 100).toFixed(2)} per round
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
