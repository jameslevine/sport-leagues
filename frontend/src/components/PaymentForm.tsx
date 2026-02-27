import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder',
);

interface PaymentFormProps {
    clientSecret: string;
    amount: number;
    currency?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

function CheckoutForm({
    amount,
    currency = 'GBP',
    onSuccess,
    onCancel,
}: Omit<PaymentFormProps, 'clientSecret'>) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        try {
            const { error: submitError } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/app/dashboard`,
                },
                redirect: 'if_required',
            });

            if (submitError) {
                setError(submitError.message || 'Payment failed');
            } else {
                onSuccess();
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Amount: {currency === 'GBP' ? '£' : '$'}
                {(amount / 100).toFixed(2)} {currency}
            </Typography>

            <PaymentElement />

            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                <Button onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!stripe || loading}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        `Pay ${currency === 'GBP' ? '£' : '$'}${(amount / 100).toFixed(2)}`
                    )}
                </Button>
            </Box>
        </Box>
    );
}

export default function PaymentForm({
    clientSecret,
    amount,
    currency = 'GBP',
    onSuccess,
    onCancel,
}: PaymentFormProps) {
    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
                amount={amount}
                currency={currency}
                onSuccess={onSuccess}
                onCancel={onCancel}
            />
        </Elements>
    );
}

interface PaymentDialogProps {
    open: boolean;
    clientSecret: string | null;
    amount: number;
    currency?: string;
    title?: string;
    onSuccess: () => void;
    onClose: () => void;
}

export function PaymentDialog({
    open,
    clientSecret,
    amount,
    currency = 'GBP',
    title = 'Complete Payment',
    onSuccess,
    onClose,
}: PaymentDialogProps) {
    if (!clientSecret) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <PaymentForm
                    clientSecret={clientSecret}
                    amount={amount}
                    currency={currency}
                    onSuccess={onSuccess}
                    onCancel={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}
