import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { useAuthStore } from './store';
import MarketingLayout from './layouts/MarketingLayout';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import ScoringRulesPage from './pages/ScoringRulesPage';
import GolfRulesPage from './pages/rules/GolfRulesPage';
import FootballRulesPage from './pages/rules/FootballRulesPage';
import BasketballRulesPage from './pages/rules/BasketballRulesPage';
import CricketRulesPage from './pages/rules/CricketRulesPage';
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
            {/* Public Marketing Pages */}
            <Route
                path="/"
                element={
                    <MarketingLayout>
                        <LandingPage />
                    </MarketingLayout>
                }
            />
            <Route
                path="/features"
                element={
                    <MarketingLayout>
                        <FeaturesPage />
                    </MarketingLayout>
                }
            />
            <Route
                path="/pricing"
                element={
                    <MarketingLayout>
                        <PricingPage />
                    </MarketingLayout>
                }
            />
            <Route
                path="/about"
                element={
                    <MarketingLayout>
                        <AboutPage />
                    </MarketingLayout>
                }
            />
            <Route
                path="/faq"
                element={
                    <MarketingLayout>
                        <FAQPage />
                    </MarketingLayout>
                }
            />
            <Route
                path="/scoring-rules"
                element={
                    <MarketingLayout>
                        <ScoringRulesPage />
                    </MarketingLayout>
                }
            />
            <Route path="/scoring-rules/golf" element={<MarketingLayout><GolfRulesPage /></MarketingLayout>} />
            <Route path="/scoring-rules/football" element={<MarketingLayout><FootballRulesPage /></MarketingLayout>} />
            <Route path="/scoring-rules/basketball" element={<MarketingLayout><BasketballRulesPage /></MarketingLayout>} />
            <Route path="/scoring-rules/cricket" element={<MarketingLayout><CricketRulesPage /></MarketingLayout>} />

            {/* Auth Pages */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

            {/* Authenticated App Pages */}
            <Route
                path="/app/*"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Routes>
                                <Route path="dashboard" element={<DashboardPage />} />
                                <Route path="leagues" element={<LeaguesPage />} />
                                <Route path="leagues/:leagueId" element={<LeagueDetailPage />} />
                                <Route path="rounds/:roundId" element={<RoundDetailPage />} />
                                <Route path="matches/:matchId" element={<MatchDetailPage />} />
                                <Route path="profile" element={<ProfilePage />} />
                                <Route path="messages" element={<MessagesPage />} />
                                <Route path="settings/notifications" element={<NotificationSettingsPage />} />
                                <Route path="" element={<Navigate to="dashboard" replace />} />
                            </Routes>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Redirect old routes to new /app prefix */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/leagues" element={<Navigate to="/app/leagues" replace />} />
            <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
            <Route path="/messages" element={<Navigate to="/app/messages" replace />} />
        </Routes>
    );
}

export default App;
