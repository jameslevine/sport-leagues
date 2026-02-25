import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText, ProgressBar } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';
import { signUp, confirmSignUp } from '../../src/services/auth';

export default function RegisterScreen() {
    const [step, setStep] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        setError('');
        setLoading(true);
        try {
            await signUp(email, password, firstName, lastName);
            setStep(1);
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setError('');
        setLoading(true);
        try {
            await confirmSignUp(email, code);
            router.replace('/(auth)/login');
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>Create Account</Text>
            <ProgressBar progress={step === 0 ? 0.5 : 1} style={styles.progress} />

            {error ? <HelperText type="error" visible>{error}</HelperText> : null}

            {step === 0 ? (
                <View>
                    <TextInput label="First Name" value={firstName} onChangeText={setFirstName} mode="outlined" style={styles.input} disabled={loading} />
                    <TextInput label="Last Name" value={lastName} onChangeText={setLastName} mode="outlined" style={styles.input} disabled={loading} />
                    <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} keyboardType="email-address" autoCapitalize="none" disabled={loading} />
                    <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" style={styles.input} secureTextEntry disabled={loading} />
                    <Button mode="contained" onPress={handleRegister} style={styles.button} loading={loading} disabled={loading}>
                        Sign Up
                    </Button>
                    <Button mode="text" onPress={() => router.back()} disabled={loading}>
                        Already have an account? Sign In
                    </Button>
                </View>
            ) : (
                <View>
                    <Text variant="bodyMedium" style={styles.verifyText}>
                        We've sent a verification code to {email}. Please check your inbox.
                    </Text>
                    <TextInput label="Verification Code" value={code} onChangeText={setCode} mode="outlined" style={styles.input} keyboardType="number-pad" disabled={loading} />
                    <Button mode="contained" onPress={handleVerify} style={styles.button} loading={loading} disabled={loading}>
                        Verify Email
                    </Button>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { textAlign: 'center', marginBottom: 16 },
    progress: { marginBottom: 16 },
    input: { marginBottom: 16 },
    button: { marginBottom: 12 },
    verifyText: { marginBottom: 16, textAlign: 'center', color: '#666' },
});
