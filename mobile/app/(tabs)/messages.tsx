import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, Avatar, Divider } from 'react-native-paper';

const mockConversations = [
    { id: '1', name: 'City Golf League Chat', lastMessage: 'Great round today!', time: '2 min ago' },
    { id: '2', name: 'John Smith', lastMessage: 'See you Saturday?', time: '1 hour ago' },
    { id: '3', name: 'Sarah Jones', lastMessage: 'Thanks for the tips!', time: 'Yesterday' },
];

export default function MessagesScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={mockConversations}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.name}
                        description={item.lastMessage}
                        left={() => <Avatar.Text size={40} label={item.name[0]} />}
                        right={() => <Text variant="bodySmall">{item.time}</Text>}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
