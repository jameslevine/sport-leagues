import { useState } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import { ExpandMore, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const faqs = [
    { q: 'How do I join a league?', a: 'Simply create a free account, browse leagues by sport and location, and click "Join League". You\'ll instantly become a member and can start signing up for rounds.' },
    { q: 'How does match scheduling work?', a: 'When a round\'s registration deadline passes (or it fills up), our algorithm automatically groups all registered players by handicap/ability into groups of up to 8. Each group gets their own match with a group chat.' },
    { q: 'What happens if not enough people join a round?', a: 'If a round doesn\'t reach the minimum number of players by the registration deadline, it\'s automatically cancelled and all entry fees are refunded to your original payment method.' },
    { q: 'How much does it cost?', a: 'Creating an account and joining leagues is completely free. You only pay when you sign up for a round — entry fees are set by league organisers and typically range from £5-£25.' },
    { q: 'Can I reschedule a match?', a: 'Yes! Any participant in a match can reschedule the date and time. All other players in your group will be notified via their preferred notification channel (push, SMS, or email).' },
    { q: 'How does handicap tracking work?', a: 'You can link your official handicap account (WHS, USGA, EGA) to your profile. Your handicap is used for match grouping to ensure fair, competitive games.' },
    { q: 'What sports are supported?', a: 'We currently support Golf, Football, Basketball, and Cricket. Each sport has its own scoring system and ranking mechanism. More sports are coming soon!' },
    { q: 'Is there a mobile app?', a: 'Yes! Our mobile app is available for both iOS and Android. You can manage leagues, chat with your match group, and track scores — all from your phone.' },
    { q: 'How do notifications work?', a: 'You can choose to receive notifications via push (mobile), SMS (via Twilio), or email. Configure your preferences in the Notification Settings page. You\'ll be notified about round deadlines, match scheduling, rescheduling, and new messages.' },
    { q: 'Can I create my own league?', a: 'Absolutely! Any registered user can create a league. Set the sport, category (open, women, kids, etc.), location, member limits, entry fees, and custom rules. You\'ll be the league admin.' },
    { q: 'What categories of leagues are available?', a: 'We support Open, Women, Kids, Beginners, Seniors, Intermediate, and Advanced categories. This ensures everyone can find a league that matches their skill level and preferences.' },
    { q: 'How do refunds work?', a: 'Refunds are processed automatically via Stripe when a round is cancelled (not enough players) or when you leave a round before the deadline. Refunds typically appear within 5-10 business days.' },
];

export default function FAQPage() {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState<string | false>(false);

    return (
        <Box>
            <Box sx={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', color: 'white', pt: 14, pb: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight={800} gutterBottom>Frequently Asked Questions</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                        Everything you need to know about Sport Leagues. Can't find what you're looking for? Contact us.
                    </Typography>
                </Container>
            </Box>
            <Box sx={{ py: 8 }}>
                <Container maxWidth="md">
                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            expanded={expanded === `panel${index}`}
                            onChange={(_, isExpanded) => setExpanded(isExpanded ? `panel${index}` : false)}
                            sx={{
                                mb: 1,
                                boxShadow: 'none',
                                border: '1px solid #E0E0E0',
                                '&:before': { display: 'none' },
                                borderRadius: '8px !important',
                                '&.Mui-expanded': { borderColor: '#1B5E20' },
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography fontWeight={600}>{faq.q}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography color="text.secondary" lineHeight={1.7}>{faq.a}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}

                    <Box sx={{ mt: 6, textAlign: 'center', p: 4, bgcolor: '#F5F5F5', borderRadius: 3 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>Still have questions?</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Can't find the answer you're looking for? Create an account and reach out to our support team.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate(ROUTES.REGISTER)}
                            endIcon={<ArrowForward />}
                        >
                            Get Started Free
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
