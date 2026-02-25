import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { useAuthStore } from './store';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LeaguesPage from './pages/LeaguesPage';
import LeagueDetailPage from './pages/LeagueDetailPage';
import RoundDetailPage from './pages/RoundDetailPage';
import MatchDetailPage from './pages/MatchDetailPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }
    return <>{children}</>;
};

function App() {
    return (
        <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Routes>
                                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                                <Route path={ROUTES.LEAGUES} element={<LeaguesPage />} />
                                <Route
                                    path={ROUTES.LEAGUE_DETAIL}
                                    element={<LeagueDetailPage />}
                                />
                                <Route
                                    path={ROUTES.ROUND_DETAIL}
                                    element={<RoundDetailPage />}
                                />
                                <Route
                                    path={ROUTES.MATCH_DETAIL}
                                    element={<MatchDetailPage />}
                                />
                                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                                <Route path={ROUTES.MESSAGES} element={<MessagesPage />} />
                                <Route
                                    path={ROUTES.NOTIFICATION_SETTINGS}
                                    element={<NotificationSettingsPage />}
                                />
                                <Route
                                    path={ROUTES.HOME}
                                    element={<Navigate to={ROUTES.DASHBOARD} replace />}
                                />
                            </Routes>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
