import { Box, Container, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Alert, Button } from '@mui/material';
import { SportsSoccer, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function FootballRulesPage() {
    const navigate = useNavigate();
    return (
        <Box>
            <Box sx={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)', color: 'white', pt: 14, pb: 8 }}>
                <Container maxWidth="lg">
                    <Button startIcon={<ArrowBack />} sx={{ color: 'white', mb: 2 }} onClick={() => navigate('/scoring-rules')}>All Sports</Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SportsSoccer sx={{ fontSize: 48 }} />
                        <Box>
                            <Typography variant="h2" fontWeight={800}>⚽ Football Rules</Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>How we play football on Sport Leagues</Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Box sx={{ py: 6 }}>
                <Container maxWidth="lg">
                    <Alert severity="info" sx={{ mb: 4, fontSize: '1rem' }}>
                        <strong>Our Format:</strong> All football on Sport Leagues is played as <strong>5-a-side</strong> with <strong>40-minute matches</strong> (2 × 20-minute halves). We use individual player points for league standings.
                    </Alert>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Match Format</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ p: 3, bgcolor: '#E3F2FD', borderRadius: 2, textAlign: 'center' }}>
                                        <Typography variant="h3" fontWeight={800} color="primary">5v5</Typography>
                                        <Typography variant="body2">Players per side</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ p: 3, bgcolor: '#E3F2FD', borderRadius: 2, textAlign: 'center' }}>
                                        <Typography variant="h3" fontWeight={800} color="primary">40 min</Typography>
                                        <Typography variant="body2">Match duration (2 × 20 min)</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ p: 3, bgcolor: '#E3F2FD', borderRadius: 2, textAlign: 'center' }}>
                                        <Typography variant="h3" fontWeight={800} color="primary">Rolling</Typography>
                                        <Typography variant="body2">Substitutions</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Typography variant="body1" color="text.secondary" paragraph lineHeight={1.8} sx={{ mt: 3 }}>
                                Matches are played on <strong>indoor or outdoor 5-a-side pitches</strong>. Rolling substitutions are allowed.
                                No offside rule. Goalkeepers can play anywhere but cannot cross the halfway line. Kick-ins instead of throw-ins.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Individual Scoring</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                                <Table>
                                    <TableHead><TableRow sx={{ bgcolor: '#E3F2FD' }}>
                                        <TableCell><strong>Action</strong></TableCell><TableCell><strong>Points</strong></TableCell><TableCell><strong>Description</strong></TableCell>
                                    </TableRow></TableHead>
                                    <TableBody>
                                        <TableRow><TableCell>Goal scored</TableCell><TableCell><strong>3 pts</strong></TableCell><TableCell>Scoring a goal</TableCell></TableRow>
                                        <TableRow><TableCell>Assist</TableCell><TableCell><strong>2 pts</strong></TableCell><TableCell>Final pass leading to a goal</TableCell></TableRow>
                                        <TableRow><TableCell>Clean sheet</TableCell><TableCell><strong>2 pts</strong></TableCell><TableCell>No goals conceded (all players)</TableCell></TableRow>
                                        <TableRow><TableCell>Win</TableCell><TableCell><strong>3 pts</strong></TableCell><TableCell>Being on the winning team</TableCell></TableRow>
                                        <TableRow><TableCell>Draw</TableCell><TableCell><strong>1 pt</strong></TableCell><TableCell>Match ends level</TableCell></TableRow>
                                        <TableRow><TableCell>Loss</TableCell><TableCell><strong>0 pts</strong></TableCell><TableCell>Being on the losing team</TableCell></TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Team Selection</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Typography variant="body1" color="text.secondary" paragraph lineHeight={1.8}>
                                Teams are <strong>randomly assigned</strong> at the start of each match to keep things fair. If there are more than 10 players, teams rotate every match. Players are grouped by the league's ability rating to ensure balanced games.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Match Day Rules</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Typography variant="body1" color="text.secondary" component="ul" sx={{ pl: 3, lineHeight: 2.2 }}>
                                <li>Arrive <strong>10 minutes before</strong> kick-off</li>
                                <li>Bring <strong>both light and dark coloured</strong> shirts</li>
                                <li>No slide tackles on indoor pitches</li>
                                <li>Fouls result in a <strong>direct free kick</strong></li>
                                <li>Goals can be scored from anywhere on the pitch</li>
                                <li>Goalkeeper must stay in their area</li>
                                <li>Record goals and assists in the app <strong>immediately after the match</strong></li>
                                <li>Respect the referee (if present) or self-referee fairly</li>
                            </Typography>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </Box>
    );
}
