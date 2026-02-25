import { ReactNode, useState } from 'react';
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Menu as MenuIcon,
    EmojiEvents as LeaguesIcon,
    Dashboard as DashboardIcon,
    Message as MessageIcon,
    Person as PersonIcon,
    SportsSoccer as SportsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store';

const DRAWER_WIDTH = 240;

const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
    { label: 'Leagues', icon: <LeaguesIcon />, path: ROUTES.LEAGUES },
    { label: 'Messages', icon: <MessageIcon />, path: ROUTES.MESSAGES },
    { label: 'Profile', icon: <PersonIcon />, path: ROUTES.PROFILE },
];

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setDrawerOpen(!drawerOpen)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <SportsIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Sport Leagues
                    </Typography>
                    <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                            {user?.firstName?.[0] || 'U'}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => { setAnchorEl(null); navigate(ROUTES.PROFILE); }}>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    width: DRAWER_WIDTH,
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <List>
                    {navItems.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    setDrawerOpen(false);
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}
