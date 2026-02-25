import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Switch, TextInput, Button, Divider } from 'react-native-paper';
import { useState } from 'react';

export default function NotificationSettingsScreen() {
    const [push, setPush] = useState(true);
    const [sms, setSms] = useState(false);
    const [email, setEmail] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSave = () => {
        // TODO: Call API to update notification preferences
    };

    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Notification Settings</Text>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Notification Channels</Text>
                    <Divider style={styles.divider} />

                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text variant="bodyLarge">Push Notifications</Text>
                            <Text variant="bodySmall" style={styles.hint}>
                                Instant notifications on your device
                            </Text>
                        </View>
                        <Switch value={push} onValueChange={setPush} />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text variant="bodyLarge">SMS Notifications</Text>
                            <Text variant="bodySmall" style={styles.hint}>
                                Text messages for important updates
                            </Text>
                        </View>
                        <Switch value={sms} onValueChange={setSms} />
                    </View>

                    {sms && (
                        <TextInput
                            label="Phone Number"
                            placeholder="+44 7700 900000"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            mode="outlined"
                            style={styles.phoneInput}
                            keyboardType="phone-pad"
                        />
                    )}

                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text variant="bodyLarge">Email Notifications</Text>
                            <Text variant="bodySmall" style={styles.hint}>
                                Email summaries and updates
                            </Text>
                        </View>
                        <Switch value={email} onValueChange={setEmail} />
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>You'll be notified about</Text>
                    <Divider style={styles.divider} />
                    <Text style={styles.bulletItem}>• Round registration deadline reminders</Text>
                    <Text style={styles.bulletItem}>• Match scheduling (group assignments)</Text>
                    <Text style={styles.bulletItem}>• Match rescheduling by other players</Text>
                    <Text style={styles.bulletItem}>• Round starting notifications</Text>
                    <Text style={styles.bulletItem}>• Payment confirmations and refunds</Text>
                    <Text style={styles.bulletItem}>• New messages in match group chats</Text>
                </Card.Content>
            </Card>

            <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                Save Preferences
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { marginBottom: 16 },
    card: { marginBottom: 16 },
    sectionTitle: { marginBottom: 8 },
    divider: { marginBottom: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    labelContainer: { flex: 1, marginRight: 16 },
    hint: { color: '#666', marginTop: 2 },
    phoneInput: { marginBottom: 16 },
    bulletItem: { marginBottom: 4 },
    saveButton: { marginBottom: 32 },
});
