import { useState } from 'react';
import { Box, Card, CardContent, CardMedia, Chip, Grid, Typography, CircularProgress, Alert, TextField, FormControl, InputLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton, Slider, Button } from '@mui/material';
import { Search, ViewList, Map as MapIcon, LocationOn } from '@mui/icons-material';
import { useLeagues, useNearbyLeagues } from '../hooks/useLeagues';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { SPORT_IMAGES } from '../constants/images';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const SPORTS = ['GOLF', 'FOOTBALL', 'BASKETBALL', 'CRICKET'];
const SPORT_ICONS: Record<string, string> = {
    GOLF: '⛳',
    FOOTBALL: '⚽',
    BASKETBALL: '🏀',
    CRICKET: '🏏',
};
const CATEGORIES = ['ALL', 'OPEN', 'WOMEN', 'BEGINNERS', 'SENIORS'];

export default function LeaguesPage() {
    const { data: allLeagues, isLoading, error } = useLeagues();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const selectedSport = useAppStore((s) => s.selectedSport);
    const setSelectedSport = useAppStore((s) => s.setSelectedSport);

    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [postcode, setPostcode] = useState('');
    const [searchPostcode, setSearchPostcode] = useState('');
    const [searchRadius, setSearchRadius] = useState(25);

    const { data: nearbyData, isLoading: nearbyLoading, error: nearbyError } = useNearbyLeagues(
        { postcode: searchPostcode, radius: searchRadius },
    );

    const isPostcodeSearch = !!searchPostcode;
    const leagues = isPostcodeSearch ? (nearbyData?.leagues || []) : (allLeagues || []);

    const filteredLeagues = leagues.filter((league) => {
        const matchesSearch = !searchText ||
            league.name.toLowerCase().includes(searchText.toLowerCase()) ||
            (league as any).region?.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || league.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handlePostcodeSearch = () => {
        if (postcode.trim()) {
            setSearchPostcode(postcode.trim());
        }
    };

    const handleClearPostcode = () => {
        setPostcode('');
        setSearchPostcode('');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">{t('leagues.title')}</Typography>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, v) => v && setViewMode(v)}
                    size="small"
                >
                    <ToggleButton value="list"><ViewList /></ToggleButton>
                    <ToggleButton value="map"><MapIcon /></ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Postcode Search */}
            <Card sx={{ mb: 3, p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <LocationOn color="primary" />
                    <TextField
                        placeholder="Enter postcode (e.g. SW1A 1AA)"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        size="small"
                        sx={{ minWidth: 200 }}
                        onKeyDown={(e) => e.key === 'Enter' && handlePostcodeSearch()}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
                        <Typography variant="body2" color="text.secondary">Radius:</Typography>
                        <Slider
                            value={searchRadius}
                            onChange={(_, v) => setSearchRadius(v as number)}
                            min={5}
                            max={100}
                            step={5}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(v) => `${v}km`}
                            sx={{ width: 120 }}
                        />
                        <Typography variant="body2">{searchRadius}km</Typography>
                    </Box>
                    <Button variant="contained" size="small" onClick={handlePostcodeSearch}>
                        Search Nearby
                    </Button>
                    {isPostcodeSearch && (
                        <Button variant="outlined" size="small" onClick={handleClearPostcode}>
                            Clear
                        </Button>
                    )}
                </Box>
                {isPostcodeSearch && nearbyData && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Found {nearbyData.leagues.length} leagues within {searchRadius}km of {searchPostcode}
                    </Typography>
                )}
            </Card>

            {/* Sport + Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <ToggleButtonGroup
                    value={selectedSport}
                    exclusive
                    onChange={(_, v) => v && setSelectedSport(v)}
                    size="small"
                >
                    {SPORTS.map((sport) => (
                        <ToggleButton key={sport} value={sport}>
                            {SPORT_ICONS[sport]} {sport.charAt(0) + sport.slice(1).toLowerCase()}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
                <TextField
                    placeholder={t('common.search') + '...'}
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
                            <MenuItem key={cat} value={cat}>
                                {cat === 'ALL' ? 'All Categories' : t(`leagues.category.${cat}`, cat)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {(isLoading || nearbyLoading) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {(error || nearbyError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {t('leagues.failedToLoad')}
                </Alert>
            )}

            {/* Map View */}
            {viewMode === 'map' && (
                <Box sx={{ height: 500, mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                    <MapContainer
                        center={
                            nearbyData?.searchLocation
                                ? [nearbyData.searchLocation.lat, nearbyData.searchLocation.lng]
                                : [51.5074, -0.1278] // Default: London
                        }
                        zoom={isPostcodeSearch ? 10 : 6}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {nearbyData?.searchLocation && (
                            <Circle
                                center={[nearbyData.searchLocation.lat, nearbyData.searchLocation.lng]}
                                radius={searchRadius * 1000}
                                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.05 }}
                            />
                        )}
                        {filteredLeagues.map((league) => (
                            league.location?.lat && league.location?.lng ? (
                                <Marker
                                    key={league.leagueId}
                                    position={[league.location.lat, league.location.lng]}
                                >
                                    <Popup>
                                        <Box sx={{ minWidth: 200 }}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {league.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                {league.category} • {league.memberCount} members
                                            </Typography>
                                            {(league as any).distance !== undefined && (
                                                <Typography variant="body2" color="primary">
                                                    {(league as any).distance}km away
                                                </Typography>
                                            )}
                                            <Typography
                                                variant="body2"
                                                color="primary"
                                                sx={{ cursor: 'pointer', mt: 0.5 }}
                                                onClick={() => navigate(`/app/leagues/${league.leagueId}`)}
                                            >
                                                View League →
                                            </Typography>
                                        </Box>
                                    </Popup>
                                </Marker>
                            ) : null
                        ))}
                    </MapContainer>
                </Box>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <>
                    {filteredLeagues.length === 0 && !isLoading && !nearbyLoading && (
                        <Alert severity="info">
                            {isPostcodeSearch
                                ? `No leagues found within ${searchRadius}km of ${searchPostcode}`
                                : t('leagues.noLeagues')}
                        </Alert>
                    )}

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {filteredLeagues.length} league{filteredLeagues.length !== 1 ? 's' : ''} found
                    </Typography>

                    <Grid container spacing={3}>
                        {filteredLeagues.map((league) => (
                            <Grid item xs={12} sm={6} md={4} key={league.leagueId}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                                        },
                                    }}
                                    onClick={() => navigate(`/app/leagues/${league.leagueId}`)}
                                >
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            height: 140,
                                            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${SPORT_IMAGES[league.sportType] || SPORT_IMAGES.GOLF})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            p: 2,
                                        }}
                                    >
                                        <Typography variant="h6" color="white" fontWeight={700} noWrap>
                                            {league.name}
                                        </Typography>
                                    </CardMedia>
                                    <CardContent sx={{ pt: 1.5 }}>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                            <Chip label={t(`leagues.category.${league.category}`, league.category)} size="small" color="primary" variant="outlined" />
                                            <Chip label={(league as any).region || ''} size="small" variant="outlined" />
                                            {(league as any).distance !== undefined && (
                                                <Chip label={`${(league as any).distance}km`} size="small" color="secondary" />
                                            )}
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {league.memberCount} {t('leagues.members')} • £{(league.entryFee / 100).toFixed(2)} per round
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Box>
    );
}
