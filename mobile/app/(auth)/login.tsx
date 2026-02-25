import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';
import { signIn } from '../../src/services/auth';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            router.replace('/(tabs)');
        } catch (err: unknown) {
            const e = err as { message?: string };
            if (e.message?.includes('not confirmed')) {
                setError('Please verify your email address first.');
            } else if (e.message?.includes('Incorrect')) {
                setError('Invalid email or password');
            } else {
                setError(e.message || 'Sign in failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>Sport Leagues</Text>
            <Text variant="bodyLarge" style={styles.subtitle}>Sign in to your account</Text>

            {error ? <HelperText type="error" visible>{error}</HelperText> : null}

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                disabled={loading}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                disabled={loading}
            />
            <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                loading={loading}
                disabled={loading}
            >
                Sign In
            </Button>
            <Button mode="text" onPress={() => router.push('/(auth)/register')} disabled={loading}>
                Don't have an account? Sign Up
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { textAlign: 'center', marginBottom: 8 },
    subtitle: { textAlign: 'center', marginBottom: 24, color: '#666' },
    input: { marginBottom: 16 },
    button: { marginBottom: 12 },
});
