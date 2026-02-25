import { Box, Container, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Alert, Button } from '@mui/material';
import { SportsGolf, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function GolfRulesPage() {
    const navigate = useNavigate();

    return (
        <Box>
            <Box sx={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', color: 'white', pt: 14, pb: 8 }}>
                <Container maxWidth="lg">
                    <Button startIcon={<ArrowBack />} sx={{ color: 'white', mb: 2 }} onClick={() => navigate('/scoring-rules')}>
                        All Sports
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SportsGolf sx={{ fontSize: 48 }} />
                        <Box>
                            <Typography variant="h2" fontWeight={800}>⛳ Golf Rules</Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>How we play golf on Sport Leagues</Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Box sx={{ py: 6 }}>
                <Container maxWidth="lg">
                    {/* Our Format */}
                    <Alert severity="info" sx={{ mb: 4, fontSize: '1rem' }}>
                        <strong>Our Format:</strong> All golf on Sport Leagues is played as <strong>Individual Stroke Play</strong> using
                        <strong> Stableford Points</strong> for league standings. We do not use match play, foursomes, or scramble formats.
                    </Alert>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Format: Stableford Points</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Typography variant="body1" color="text.secondary" paragraph lineHeight={1.8}>
                                While you record your strokes per hole (stroke play), your <strong>league standings</strong> are calculated
                                using the <strong>Modified Stableford</strong> points system. This rewards consistent play and means one bad
                                hole doesn't ruin your entire round.
                            </Typography>

                            <Typography variant="h6" fontWeight={600} gutterBottom>Stableford Points Table</Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#E8F5E9' }}>
                                            <TableCell><strong>Score vs Par</strong></TableCell>
                                            <TableCell><strong>Name</strong></TableCell>
                                            <TableCell><strong>Points</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow><TableCell>3+ under par</TableCell><TableCell>Albatross or better</TableCell><TableCell><strong>5 points</strong></TableCell></TableRow>
                                        <TableRow><TableCell>2 under par</TableCell><TableCell>Eagle</TableCell><TableCell><strong>4 points</strong></TableCell></TableRow>
                                        <TableRow><TableCell>1 under par</TableCell><TableCell>Birdie</TableCell><TableCell><strong>3 points</strong></TableCell></TableRow>
                                        <TableRow><TableCell>Par</TableCell><TableCell>Par</TableCell><TableCell><strong>2 points</strong></TableCell></TableRow>
                                        <TableRow><TableCell>1 over par</TableCell><TableCell>Bogey</TableCell><TableCell><strong>1 point</strong></TableCell></TableRow>
                                        <TableRow><TableCell>2+ over par</TableCell><TableCell>Double bogey or worse</TableCell><TableCell><strong>0 points</strong></TableCell></TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                                Points are calculated using your <strong>net score</strong> (after handicap strokes are applied).
                                A round of 36 Stableford points is considered "playing to your handicap".
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Round Format</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ p: 3, bgcolor: '#F5F5F5', borderRadius: 2 }}>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>Standard Round</Typography>
                                        <Typography variant="body2" color="text.secondary">• <strong>18 holes</strong> (full round)</Typography>
                                        <Typography variant="body2" color="text.secondary">• Individual stroke play</Typography>
                                        <Typography variant="body2" color="text.secondary">• Stableford points for standings</Typography>
                                        <Typography variant="body2" color="text.secondary">• Groups of <strong>up to 4 players</strong> on course</Typography>
                                        <Typography variant="body2" color="text.secondary">• <strong>Up to 8 players</strong> per match group</Typography>
                                        <Typography variant="body2" color="text.secondary">• Tee times arranged by the group</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ p: 3, bgcolor: '#F5F5F5', borderRadius: 2 }}>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>9-Hole Option</Typography>
                                        <Typography variant="body2" color="text.secondary">• <strong>9 holes</strong> (half round)</Typography>
                                        <Typography variant="body2" color="text.secondary">• Available if league organiser enables it</Typography>
                                        <Typography variant="body2" color="text.secondary">• Points count as half a round for standings</Typography>
                                        <Typography variant="body2" color="text.secondary">• Great for weekday evening games</Typography>
                                        <Typography variant="body2" color="text.secondary">• Same scoring rules apply</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>What You Record</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Typography variant="h6" fontWeight={600} gutterBottom>Per Hole (Required)</Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#E8F5E9' }}>
                                            <TableCell><strong>Field</strong></TableCell>
                                            <TableCell><strong>Description</strong></TableCell>
                                            <TableCell><strong>Example</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow><TableCell>Strokes</TableCell><TableCell>Total strokes taken on the hole</TableCell><TableCell>5</TableCell></TableRow>
                                        <TableRow><TableCell>Putts</TableCell><TableCell>Number of putts on the green</TableCell><TableCell>2</TableCell></TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Par for each hole is pre-loaded from the course data. You just need to enter your strokes and putts.
                            </Typography>

                            <Typography variant="h6" fontWeight={600} gutterBottom>Per Round (Auto-calculated)</Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#E8F5E9' }}>
                                            <TableCell><strong>Metric</strong></TableCell>
                                            <TableCell><strong>How It's Calculated</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow><TableCell>Gross Score</TableCell><TableCell>Sum of all strokes</TableCell></TableRow>
                                        <TableRow><TableCell>Net Score</TableCell><TableCell>Gross score − course handicap</TableCell></TableRow>
                                        <TableRow><TableCell>Stableford Points</TableCell><TableCell>Sum of points per hole (using net score)</TableCell></TableRow>
                                        <TableRow><TableCell>Total Putts</TableCell><TableCell>Sum of all putts</TableCell></TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Handicaps</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Typography variant="body1" color="text.secondary" paragraph lineHeight={1.8}>
                                <strong>We strongly recommend linking your official handicap.</strong> Your handicap index is used to:
                            </Typography>
                            <Typography variant="body1" color="text.secondary" component="ul" sx={{ pl: 3, lineHeight: 2 }}>
                                <li>Calculate your <strong>course handicap</strong> for each course you play</li>
                                <li>Determine your <strong>net score</strong> and Stableford points</li>
                                <li>Group you with players of <strong>similar ability</strong></li>
                                <li>Maintain <strong>fair competition</strong> across the league</li>
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph lineHeight={1.8} sx={{ mt: 2 }}>
                                We support handicaps from <strong>WHS</strong> (World Handicap System), <strong>USGA</strong>, and <strong>EGA</strong>.
                                If you don't have an official handicap, you can enter an estimated one — but it won't be marked as verified.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                                <strong>Course handicap formula:</strong> Handicap Index × (Slope Rating ÷ 113) + (Course Rating − Par)
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>Match Day Etiquette</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Typography variant="body1" color="text.secondary" component="ul" sx={{ pl: 3, lineHeight: 2.2 }}>
                                <li>Arrive at the course <strong>at least 15 minutes</strong> before your tee time</li>
                                <li>Play <strong>ready golf</strong> — hit when ready, don't wait for honours</li>
                                <li>Keep pace of play — aim for <strong>under 4 hours 15 minutes</strong> for 18 holes</li>
                                <li>Repair pitch marks, replace divots, and rake bunkers</li>
                                <li>Record scores <strong>immediately after each hole</strong> in the app</li>
                                <li>Verify your playing partner's score at the end of the round</li>
                                <li>If you need to reschedule, do it through the <strong>group chat</strong> so everyone is notified</li>
                                <li>Maximum score on any hole is <strong>net double bogey</strong> (for handicap purposes)</li>
                            </Typography>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </Box>
    );
}
