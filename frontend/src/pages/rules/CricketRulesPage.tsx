import { Box, Container, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Alert, Button } from '@mui/material';
import { SportsCricket, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function CricketRulesPage() {
    const navigate = useNavigate();
    return (
        <Box>
            <Box sx={{ background: 'linear-gradient(135deg, #6A1B9A, #8E24AA)', color: 'white', pt: 14, pb: 8 }}>
                <Container maxWidth="lg">
                    <Button startIcon={<ArrowBack />} sx={{ color: 'white', mb: 2 }} onClick={() => navigate('/scoring-rules')}>All Sports</Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SportsCricket sx={{ fontSize: 48 }} />
                        <Box>
                            <Typography variant="h2" fontWeight={800}>🏏 Cricket Rules</Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>How we play cricket on Sport Leagues</Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Box sx={{ py: 6 }}>
                <Container maxWidth="lg">
                    <Alert severity="info" sx={{ mb: 4, fontSize: '1rem' }}>
                        <strong>Our Format:</strong> All cricket on Sport Leagues is played as <strong>T10</strong> (10 overs per side) with <strong>8 players per team</strong>. Matches last approximately 90 minutes. Individual batting and bowling stats tracked.
                    </Alert>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Match Format</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={3}><Box sx={{ p: 3, bgcolor: '#F3E5F5', borderRadius: 2, textAlign: 'center' }}><Typography variant="h3" fontWeight={800} sx={{ color: '#6A1B9A' }}>T10</Typography><Typography variant="body2">10 overs per side</Typography></Box></Grid>
                                <Grid item xs={12} md={3}><Box sx={{ p: 3, bgcolor: '#F3E5F5', borderRadius: 2, textAlign: 'center' }}><Typography variant="h3" fontWeight={800} sx={{ color: '#6A1B9A' }}>8v8</Typography><Typography variant="body2">Players per team</Typography></Box></Grid>
                                <Grid item xs={12} md={3}><Box sx={{ p: 3, bgcolor: '#F3E5F5', borderRadius: 2, textAlign: 'center' }}><Typography variant="h3" fontWeight={800} sx={{ color: '#6A1B9A' }}>~90 min</Typography><Typography variant="body2">Match duration</Typography></Box></Grid>
                                <Grid item xs={12} md={3}><Box sx={{ p: 3, bgcolor: '#F3E5F5', borderRadius: 2, textAlign: 'center' }}><Typography variant="h3" fontWeight={800} sx={{ color: '#6A1B9A' }}>2 overs</Typography><Typography variant="body2">Max per bowler</Typography></Box></Grid>
                            </Grid>
                            <Typography variant="body1" color="text.secondary" paragraph lineHeight={1.8} sx={{ mt: 3 }}>
                                We chose <strong>T10 format</strong> because it's fast, exciting, and fits into a 90-minute slot — perfect for after-work or weekend games. Each bowler can bowl a <strong>maximum of 2 overs</strong>. All batsmen must bat. Powerplay is the first 2 overs (only 2 fielders outside the circle).
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Batting Stats & Points</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                                <Table>
                                    <TableHead><TableRow sx={{ bgcolor: '#F3E5F5' }}><TableCell><strong>Stat</strong></TableCell><TableCell><strong>League Points</strong></TableCell></TableRow></TableHead>
                                    <TableBody>
                                        <TableRow><TableCell>Runs scored</TableCell><TableCell>1 pt per run</TableCell></TableRow>
                                        <TableRow><TableCell>Four (boundary)</TableCell><TableCell>+1 bonus pt</TableCell></TableRow>
                                        <TableRow><TableCell>Six (maximum)</TableCell><TableCell>+2 bonus pts</TableCell></TableRow>
                                        <TableRow><TableCell>30+ runs</TableCell><TableCell>+5 bonus pts</TableCell></TableRow>
                                        <TableRow><TableCell>50+ runs</TableCell><TableCell>+10 bonus pts</TableCell></TableRow>
                                        <TableRow><TableCell>Duck (0 runs, dismissed)</TableCell><TableCell>-3 pts</TableCell></TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Bowling Stats & Points</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                                <Table>
                                    <TableHead><TableRow sx={{ bgcolor: '#F3E5F5' }}><TableCell><strong>Stat</strong></TableCell><TableCell><strong>League Points</strong></TableCell></TableRow></TableHead>
                                    <TableBody>
                                        <TableRow><TableCell>Wicket taken</TableCell><TableCell>10 pts per wicket</TableCell></TableRow>
                                        <TableRow><TableCell>Maiden over</TableCell><TableCell>+5 pts</TableCell></TableRow>
                                        <TableRow><TableCell>3+ wickets in a match</TableCell><TableCell>+10 bonus pts</TableCell></TableRow>
                                        <TableRow><TableCell>Economy rate under 6</TableCell><TableCell>+5 bonus pts</TableCell></TableRow>
                                        <TableRow><TableCell>Wide/No ball</TableCell><TableCell>-1 pt each</TableCell></TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Fielding & Team Points</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead><TableRow sx={{ bgcolor: '#F3E5F5' }}><TableCell><strong>Action</strong></TableCell><TableCell><strong>League Points</strong></TableCell></TableRow></TableHead>
                                    <TableBody>
                                        <TableRow><TableCell>Catch taken</TableCell><TableCell>5 pts</TableCell></TableRow>
                                        <TableRow><TableCell>Run out (direct hit)</TableCell><TableCell>5 pts</TableCell></TableRow>
                                        <TableRow><TableCell>Stumping</TableCell><TableCell>5 pts</TableCell></TableRow>
                                        <TableRow><TableCell>Win</TableCell><TableCell>+5 pts (all players)</TableCell></TableRow>
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
                                <li>Arrive <strong>15 minutes before</strong> the match</li>
                                <li>Bring your own <strong>bat, pads, and gloves</strong> (stumps provided)</li>
                                <li>Teams are assigned by the app based on <strong>ability rating</strong></li>
                                <li>Toss is done in the app — winner chooses to bat or bowl</li>
                                <li>LBW decisions are <strong>umpire's call</strong> (or agreed by both teams)</li>
                                <li>One short boundary is allowed if the ground requires it</li>
                                <li>Record all stats in the app <strong>ball by ball</strong> or after each over</li>
                                <li>Retired batsmen can return at the fall of the last wicket</li>
                            </Typography>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </Box>
    );
}
