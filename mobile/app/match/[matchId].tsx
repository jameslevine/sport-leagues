import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, Chip, Divider, Portal, Dialog, TextInput } from 'react-native-paper';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function MatchDetailScreen() {
    const { matchId } = useLocalSearchParams();
    const [rescheduleVisible, setRescheduleVisible] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const mockMatch = {
        groupNumber: 1,
        scheduledDate: '2026-03-15',
        scheduledTime: '08:00',
        venue: { name: 'Royal Links Golf Course' },
        status: 'SCHEDULED',
        players: [
            { userId: '1', displayName: 'John Smith', handicap: 12.4 },
            { userId: '2', displayName: 'Sarah Jones', handicap: 8.2 },
            { userId: '3', displayName: 'Mike Brown', handicap: 15.1 },
            { userId: '4', displayName: 'Emma Wilson', handicap: 10.8 },
        ],
    };

    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>
                Match - Group {mockMatch.groupNumber}
            </Text>
            <Chip style={styles.chip}>{mockMatch.status}</Chip>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="bodyLarge">
                        {mockMatch.scheduledDate} at {mockMatch.scheduledTime}
                    </Text>
                    <Text variant="bodyMedium" style={styles.venue}>
                        {mockMatch.venue.name}
                    </Text>
                    <View style={styles.actions}>
                        <Button mode="outlined" onPress={() => setRescheduleVisible(true)}>
                            Reschedule
                        </Button>
                        <Button mode="outlined" onPress={() => { }}>
                            Group Chat
                        </Button>
                    </View>
                </Card.Content>
            </Card>

            <Text variant="titleMedium" style={styles.sectionTitle}>
                Players ({mockMatch.players.length})
            </Text>
            {mockMatch.players.map((player) => (
                <Card key={player.userId} style={styles.playerCard}>
                    <Card.Content style={styles.playerRow}>
                        <Avatar.Text size={40} label={player.displayName[0]} />
                        <View style={styles.playerInfo}>
                            <Text variant="bodyLarge">{player.displayName}</Text>
                            <Text variant="bodySmall">Handicap: {player.handicap}</Text>
                        </View>
                    </Card.Content>
                </Card>
            ))}

            <Portal>
                <Dialog visible={rescheduleVisible} onDismiss={() => setRescheduleVisible(false)}>
                    <Dialog.Title>Reschedule Match</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodySmall" style={styles.dialogHint}>
                            All players will be notified of the new date and time.
                        </Text>
                        <TextInput
                            label="New Date (YYYY-MM-DD)"
                            value={newDate}
                            onChangeText={setNewDate}
                            mode="outlined"
                            style={styles.input}
                        />
                        <TextInput
                            label="New Time (HH:MM)"
                            value={newTime}
                            onChangeText={setNewTime}
                            mode="outlined"
                            style={styles.input}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setRescheduleVisible(false)}>Cancel</Button>
                        <Button mode="contained" onPress={() => setRescheduleVisible(false)}>
                            Reschedule
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { marginBottom: 8 },
    chip: { alignSelf: 'flex-start', marginBottom: 16 },
    card: { marginBottom: 16 },
    venue: { color: '#666', marginTop: 4 },
    actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
    sectionTitle: { marginBottom: 12 },
    playerCard: { marginBottom: 8 },
    playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    playerInfo: { flex: 1 },
    dialogHint: { color: '#666', marginBottom: 12 },
    input: { marginBottom: 12 },
});
