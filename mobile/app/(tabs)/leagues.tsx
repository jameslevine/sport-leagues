import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Chip, FAB } from 'react-native-paper';

const mockLeagues = [
    { leagueId: '1', name: 'City Golf League', category: 'OPEN', memberCount: 45, maxMembers: 100 },
    { leagueId: '2', name: "Women's Golf Society", category: 'WOMEN', memberCount: 22, maxMembers: 50 },
    { leagueId: '3', name: 'Junior Golf Academy', category: 'KIDS', memberCount: 18, maxMembers: 30 },
];

export default function LeaguesScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={mockLeagues}
                keyExtractor={(item) => item.leagueId}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text variant="titleMedium">{item.name}</Text>
                            <View style={styles.chips}>
                                <Chip compact>{item.category}</Chip>
                                <Text variant="bodySmall">{item.memberCount}/{item.maxMembers} members</Text>
                            </View>
                        </Card.Content>
                    </Card>
                )}
            />
            <FAB icon="plus" style={styles.fab} onPress={() => { }} label="Create League" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    card: { marginBottom: 12 },
    chips: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
    fab: { position: 'absolute', right: 16, bottom: 16 },
});
