import { ReactNode } from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography, useScrollTrigger } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SportsSoccer } from '@mui/icons-material';
import { ROUTES } from '../constants/routes';

interface MarketingLayoutProps {
    children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
    const navigate = useNavigate();
    const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 });

    return (
        <Box>
            <AppBar
                position="fixed"
                elevation={trigger ? 4 : 0}
                sx={{
                    background: trigger
                        ? 'rgba(27, 94, 32, 0.95)'
                        : 'transparent',
                    backdropFilter: trigger ? 'blur(10px)' : 'none',
                    transition: 'all 0.3s ease',
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                            onClick={() => navigate(ROUTES.HOME)}
                        >
                            <SportsSoccer sx={{ fontSize: 32 }} />
                            <Typography variant="h6" fontWeight={700} color="white">
                                Sport Leagues
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Button color="inherit" onClick={() => navigate('/features')} sx={{ fontWeight: 500 }}>
                                Features
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/pricing')} sx={{ fontWeight: 500 }}>
                                Pricing
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/about')} sx={{ fontWeight: 500 }}>
                                About
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/faq')} sx={{ fontWeight: 500 }}>
                                FAQ
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => navigate(ROUTES.LOGIN)}
                                sx={{ ml: 1, borderColor: 'rgba(255,255,255,0.5)' }}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate(ROUTES.REGISTER)}
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                                    fontWeight: 600,
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box>{children}</Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    bgcolor: '#1a1a2e',
                    color: 'white',
                    py: 6,
                    px: 3,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, mb: 4 }}>
                        <Box sx={{ flex: '1 1 250px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <SportsSoccer />
                                <Typography variant="h6" fontWeight={700}>Sport Leagues</Typography>
                            </Box>
                            <Typography variant="body2" color="grey.400">
                                Join local sports leagues, get matched with players your level, and track your scores officially.
                            </Typography>
                        </Box>
                        <Box sx={{ flex: '1 1 150px' }}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>Product</Typography>
                            <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', mb: 1 }} onClick={() => navigate('/features')}>Features</Typography>
                            <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', mb: 1 }} onClick={() => navigate('/pricing')}>Pricing</Typography>
                            <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', mb: 1 }} onClick={() => navigate('/faq')}>FAQ</Typography>
                            <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', mb: 1 }} onClick={() => navigate('/scoring-rules')}>Scoring Rules</Typography>
                        </Box>
                        <Box sx={{ flex: '1 1 150px' }}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>Company</Typography>
                            <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', mb: 1 }} onClick={() => navigate('/about')}>About</Typography>
                            <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', mb: 1 }}>Contact</Typography>
                            <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', mb: 1 }}>Privacy Policy</Typography>
                        </Box>
                        <Box sx={{ flex: '1 1 150px' }}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>Sports</Typography>
                            <Typography variant="body2" color="grey.400" sx={{ mb: 1 }}>Golf</Typography>
                            <Typography variant="body2" color="grey.400" sx={{ mb: 1 }}>Football</Typography>
                            <Typography variant="body2" color="grey.400" sx={{ mb: 1 }}>Basketball</Typography>
                            <Typography variant="body2" color="grey.400" sx={{ mb: 1 }}>Cricket</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="grey.500">
                            © 2026 Sport Leagues. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
