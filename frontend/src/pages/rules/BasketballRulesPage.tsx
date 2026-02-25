import { Box, Container, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Alert, Button } from '@mui/material';
import { SportsBasketball, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function BasketballRulesPage() {
    const navigate = useNavigate();
    return (
        <Box>
            <Box sx={{ background: 'linear-gradient(135deg, #E65100, #F57C00)', color: 'white', pt: 14, pb: 8 }}>
                <Container maxWidth="lg">
                    <Button startIcon={<ArrowBack />} sx={{ color: 'white', mb: 2 }} onClick={() => navigate('/scoring-rules')}>All Sports</Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SportsBasketball sx={{ fontSize: 48 }} />
                        <Box>
                            <Typography variant="h2" fontWeight={800}>🏀 Basketball Rules</Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>How we play basketball on Sport Leagues</Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Box sx={{ py: 6 }}>
                <Container maxWidth="lg">
                    <Alert severity="info" sx={{ mb: 4, fontSize: '1rem' }}>
                        <strong>Our Format:</strong> All basketball on Sport Leagues is played as <strong>3v3 half-court</strong> with <strong>15-minute games</strong> or first to 21 points. Individual stats tracked for league standings.
                    </Alert>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Match Format</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={3}><Box sx={{ p: 3, bgcolor: '#FFF3E0', borderRadius: 2, textAlign: 'center' }}><Typography variant="h3" fontWeight={800} sx={{ color: '#E65100' }}>3v3</Typography><Typography variant="body2">Players per side</Typography></Box></Grid>
                                <Grid item xs={12} md={3}><Box sx={{ p: 3, bgcolor: '#FFF3E0', borderRadius: 2, textAlign: 'center' }}><Typography variant="h3" fontWeight={800} sx={{ color: '#E65100' }}>15 min</Typography><Typography variant="body2">Game duration</Typography></Box></Grid>
                                <Grid item xs={12} md={3}><Box sx={{ p: 3, bgcolor: '#FFF3E0', borderRadius: 2, textAlign: 'center' }}><Typography variant="h3" fontWeight={800} sx={{ color: '#E65100' }}>21 pts</Typography><Typography variant="body2">Or first to 21</Typography></Box></Grid>
                                <Grid item xs={12} md={3}><Box sx={{ p: 3, bgcolor: '#FFF3E0', borderRadius: 2, textAlign: 'center' }}><Typography variant="h3" fontWeight={800} sx={{ color: '#E65100' }}>Half</Typography><Typography variant="body2">Court only</Typography></Box></Grid>
                            </Grid>
                            <Typography variant="body1" color="text.secondary" paragraph lineHeight={1.8} sx={{ mt: 3 }}>
                                Games follow <strong>FIBA 3x3 rules</strong>. Shots inside the arc = 1 point, outside the arc = 2 points. Ball must be "checked" (passed to opponent behind the arc) after each score. 12-second shot clock. Win by 2 if tied at 21.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Individual Stats Tracked</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead><TableRow sx={{ bgcolor: '#FFF3E0' }}><TableCell><strong>Stat</strong></TableCell><TableCell><strong>Description</strong></TableCell><TableCell><strong>League Points</strong></TableCell></TableRow></TableHead>
                                    <TableBody>
                                        <TableRow><TableCell>Points scored</TableCell><TableCell>Total points in the game</TableCell><TableCell>1 pt per point scored</TableCell></TableRow>
                                        <TableRow><TableCell>Assists</TableCell><TableCell>Passes leading to a score</TableCell><TableCell>2 pts each</TableCell></TableRow>
                                        <TableRow><TableCell>Rebounds</TableCell><TableCell>Offensive + defensive</TableCell><TableCell>1 pt each</TableCell></TableRow>
                                        <TableRow><TableCell>Steals</TableCell><TableCell>Taking the ball</TableCell><TableCell>2 pts each</TableCell></TableRow>
                                        <TableRow><TableCell>Blocks</TableCell><TableCell>Blocking a shot</TableCell><TableCell>2 pts each</TableCell></TableRow>
                                        <TableRow><TableCell>Win bonus</TableCell><TableCell>Being on winning team</TableCell><TableCell>5 pts</TableCell></TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Match Day Rules</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Typography variant="body1" color="text.secondary" component="ul" sx={{ pl: 3, lineHeight: 2.2 }}>
                                <li>Arrive <strong>10 minutes before</strong> game time</li>
                                <li>Bring your own <strong>basketball shoes</strong> (no outdoor shoes on indoor courts)</li>
                                <li>Teams are <strong>randomly assigned</strong> or picked by captains</li>
                                <li><strong>Self-officiate</strong> — call your own fouls honestly</li>
                                <li>After 7 team fouls, opponent shoots <strong>2 free throws</strong></li>
                                <li>Record stats in the app <strong>immediately after the game</strong></li>
                                <li>If a player doesn't show, teams adjust to <strong>2v2</strong></li>
                            </Typography>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </Box>
    );
}
