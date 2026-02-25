import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Card, Button, Divider } from 'react-native-paper';

export default function ProfileScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Avatar.Text size={80} label="TU" />
                <Text variant="headlineSmall" style={styles.name}>Test User</Text>
                <Text variant="bodyMedium" style={styles.email}>test@example.com</Text>
            </View>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">Sport Profile</Text>
                    <Divider style={styles.divider} />
                    <Text>Handicap: --</Text>
                    <Text variant="bodySmall" style={styles.hint}>
                        Link your official handicap account to track your ranking
                    </Text>
                    <Button mode="outlined" style={styles.linkButton}>Link Handicap Account</Button>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">Statistics</Text>
                    <Divider style={styles.divider} />
                    <Text>Rounds Played: 0</Text>
                    <Text>Leagues Joined: 0</Text>
                    <Text>Followers: 0</Text>
                    <Text>Following: 0</Text>
                </Card.Content>
            </Card>

            <Button mode="outlined" textColor="red" style={styles.logoutButton}>
                Sign Out
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { alignItems: 'center', marginBottom: 24 },
    name: { marginTop: 12 },
    email: { color: '#666' },
    card: { marginBottom: 16 },
    divider: { marginVertical: 12 },
    hint: { color: '#666', marginTop: 4 },
    linkButton: { marginTop: 12 },
    logoutButton: { marginTop: 8, marginBottom: 32 },
});
