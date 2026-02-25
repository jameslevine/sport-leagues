import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>Create Account</Text>
            <TextInput label="First Name" value={firstName} onChangeText={setFirstName} mode="outlined" style={styles.input} />
            <TextInput label="Last Name" value={lastName} onChangeText={setLastName} mode="outlined" style={styles.input} />
            <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} keyboardType="email-address" autoCapitalize="none" />
            <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" style={styles.input} secureTextEntry />
            <Button mode="contained" onPress={() => { }} style={styles.button}>Sign Up</Button>
            <Button mode="text" onPress={() => router.back()}>Already have an account? Sign In</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { textAlign: 'center', marginBottom: 24 },
    input: { marginBottom: 16 },
    button: { marginBottom: 12 },
});
