import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function DashboardScreen() {
    const stats = [
        { label: 'My Leagues', value: '3' },
        { label: 'Upcoming Rounds', value: '2' },
        { label: 'Following', value: '15' },
        { label: 'Rounds Played', value: '24' },
    ];

    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Dashboard</Text>
            <View style={styles.grid}>
                {stats.map((stat) => (
                    <Card key={stat.label} style={styles.card}>
                        <Card.Content>
                            <Text variant="headlineLarge">{stat.value}</Text>
                            <Text variant="bodyMedium">{stat.label}</Text>
                        </Card.Content>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { marginBottom: 16 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    card: { width: '47%' },
});
