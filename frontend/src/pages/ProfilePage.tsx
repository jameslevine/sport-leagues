import { useState, useRef } from 'react';
import {
    Box, Typography, Avatar, Card, CardContent, Grid,
    CircularProgress, Alert, Button, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, Paper, Chip,
} from '@mui/material';
import { Edit, PhotoCamera, People, PersonAdd, EmojiEvents, SportsGolf } from '@mui/icons-material';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { useAuthStore, useAppStore } from '../store';
import { signOut } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/apiClient';
import { GRADIENTS } from '../constants/images';

export default function ProfilePage() {
    const { data: profile, isLoading, error } = useProfile();
    const updateProfile = useUpdateProfile();
    const authUser = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const sport = useAppStore((s) => s.selectedSport).toLowerCase();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({ firstName: '', lastName: '', displayName: '' });
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleLogout = () => { signOut(); logout(); navigate(ROUTES.LOGIN); };

    const handleEditOpen = () => {
        setEditData({
            firstName: (profile as any)?.firstName || '',
            lastName: (profile as any)?.lastName || '',
            displayName: (profile as any)?.displayName || '',
        });
        setEditOpen(true);
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync(editData);
            setEditOpen(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) { console.error('Failed to update profile:', err); }
    };

    const handlePhotoClick = () => { fileInputRef.current?.click(); };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setUploadError('Please select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { setUploadError('Image must be less than 5MB'); return; }

        setUploading(true);
        setUploadError(null);
        try {
            const { uploadUrl, publicUrl } = await apiClient.get<{ uploadUrl: string; publicUrl: string; key: string }>(
                `/${sport}/uploads/avatar-url?contentType=${encodeURIComponent(file.type)}`,
            );
            await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
            await updateProfile.mutateAsync({ avatarUrl: publicUrl } as any);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setUploadError('Failed to upload photo. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={48} /></Box>;
    }

    const user = profile || authUser;

    return (
        <Box>
            {saveSuccess && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Profile updated successfully!</Alert>}
            {uploadError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{uploadError}</Alert>}
            {error && <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>{t('common.error')}</Alert>}

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

            {/* Hero Cover */}
            <Paper
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    mb: -6,
                    position: 'relative',
                }}
                elevation={0}
            >
                <Box
                    sx={{
                        height: 200,
                        background: GRADIENTS.cool,
                        position: 'relative',
                    }}
                >
                    <Box sx={{ position: 'absolute', right: 16, top: 16 }}>
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={handleEditOpen}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                                textTransform: 'none',
                                borderRadius: 2,
                            }}
                        >
                            Edit Profile
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Profile Card */}
            <Card sx={{ mx: 3, borderRadius: 3, position: 'relative', zIndex: 1 }} elevation={2}>
                <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, mt: -5 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={(profile as any)?.avatarUrl}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    fontSize: 40,
                                    border: '4px solid white',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                }}
                            >
                                {(user as any)?.firstName?.[0] || (user as any)?.displayName?.[0] || 'U'}
                            </Avatar>
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                    width: 32,
                                    height: 32,
                                }}
                                onClick={handlePhotoClick}
                                disabled={uploading}
                            >
                                {uploading ? <CircularProgress size={16} color="inherit" /> : <PhotoCamera sx={{ fontSize: 16 }} />}
                            </IconButton>
                        </Box>
                        <Box sx={{ pb: 1 }}>
                            <Typography variant="h5" fontWeight={700}>
                                {(user as any)?.firstName} {(user as any)?.lastName}
                            </Typography>
                            {(user as any)?.displayName && (
                                <Typography variant="body2" color="text.secondary">@{(user as any)?.displayName}</Typography>
                            )}
                            <Typography variant="body2" color="text.secondary">{(user as any)?.email}</Typography>
                        </Box>
                    </Box>

                    {/* Stats Row */}
                    <Box sx={{ display: 'flex', gap: 3, mt: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <People sx={{ color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="h6" fontWeight={700}>{(profile as any)?.followersCount ?? 0}</Typography>
                                <Typography variant="caption" color="text.secondary">{t('profile.followers')}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonAdd sx={{ color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="h6" fontWeight={700}>{(profile as any)?.followingCount ?? 0}</Typography>
                                <Typography variant="caption" color="text.secondary">{t('profile.following')}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Info Cards */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, height: '100%' }} elevation={0}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <SportsGolf color="primary" />
                                <Typography variant="h6" fontWeight={600}>{t('profile.sportProfile')}</Typography>
                            </Box>
                            <Chip
                                label={`Handicap: ${(profile as any)?.sportProfiles?.GOLF?.handicapIndex ?? 'Not set'}`}
                                sx={{ borderRadius: 2 }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                {t('profile.linkHandicap')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, height: '100%' }} elevation={0}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <EmojiEvents color="primary" />
                                <Typography variant="h6" fontWeight={600}>Quick Actions</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate('/app/settings/notifications')}
                                    sx={{ borderRadius: 2, textTransform: 'none' }}
                                >
                                    {t('profile.notificationSettings')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate('/app/matches')}
                                    sx={{ borderRadius: 2, textTransform: 'none' }}
                                >
                                    My Matches
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={handleLogout}
                                    sx={{ borderRadius: 2, textTransform: 'none' }}
                                >
                                    {t('auth.signOut')}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField label="First Name" value={editData.firstName} onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} fullWidth />
                        <TextField label="Last Name" value={editData.lastName} onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} fullWidth />
                        <TextField label="Display Name" value={editData.displayName} onChange={(e) => setEditData({ ...editData, displayName: e.target.value })} fullWidth />
                        <Typography variant="body2" color="text.secondary">To change your profile photo, click the camera icon on your avatar.</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={updateProfile.isPending} sx={{ borderRadius: 2 }}>
                        {updateProfile.isPending ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
