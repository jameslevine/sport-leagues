import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // TODO: Implement Cognito auth
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>Sport Leagues</Text>
            <Text variant="bodyLarge" style={styles.subtitle}>Sign in to your account</Text>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
            />
            <Button mode="contained" onPress={handleLogin} style={styles.button}>
                Sign In
            </Button>
            <Button mode="text" onPress={() => router.push('/(auth)/register')}>
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
