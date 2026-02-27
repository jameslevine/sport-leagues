import { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
    CircularProgress,
    Alert,
    TextField,
    IconButton,
    Paper,
    Chip,
} from '@mui/material';
import { Send, ArrowBack } from '@mui/icons-material';
import {
    useConversations,
    useConversationMessages,
    useSendMessage,
} from '../hooks/useConversations';
import { useAuthStore } from '../store';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function MessagesPage() {
    const { data: conversations, isLoading, error } = useConversations();
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const { t } = useTranslation();

    if (selectedConversationId) {
        return (
            <ConversationDetail
                conversationId={selectedConversationId}
                onBack={() => setSelectedConversationId(null)}
            />
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {t('messages.title')}
            </Typography>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {t('messages.failedToLoad')}
                </Alert>
            )}

            {!isLoading && !error && (!conversations || conversations.length === 0) && (
                <Alert severity="info">
                    {t('messages.noMessages')}
                </Alert>
            )}

            <List>
                {(conversations || []).map((conv, index) => (
                    <Box key={conv.conversationId}>
                        <ListItem
                            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                            onClick={() => setSelectedConversationId(conv.conversationId)}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    {conv.name?.[0] || conv.type?.[0] || 'C'}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={conv.name || `${conv.type} Chat`}
                                secondary={`${conv.participants.length} participants`}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {dayjs(conv.lastMessageAt).fromNow()}
                                </Typography>
                                <Chip label={conv.type} size="small" variant="outlined" />
                            </Box>
                        </ListItem>
                        {index < (conversations?.length || 0) - 1 && <Divider />}
                    </Box>
                ))}
            </List>
        </Box>
    );
}

function ConversationDetail({
    conversationId,
    onBack,
}: {
    conversationId: string;
    onBack: () => void;
}) {
    const { data, isLoading, error } = useConversationMessages(conversationId);
    const sendMessage = useSendMessage(conversationId);
    const [messageText, setMessageText] = useState('');
    const currentUser = useAuthStore((s) => s.user);
    const { t } = useTranslation();

    const handleSend = async () => {
        if (!messageText.trim()) return;
        try {
            await sendMessage.mutateAsync({ content: messageText.trim() });
            setMessageText('');
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <IconButton onClick={onBack}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6">
                    {data?.conversation?.name || t('messages.conversation')}
                </Typography>
                {data?.conversation && (
                    <Chip
                        label={`${data.conversation.participants.length} members`}
                        size="small"
                        variant="outlined"
                    />
                )}
            </Box>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {t('messages.failedToLoadMessages')}
                </Alert>
            )}

            {/* Messages */}
            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    gap: 1,
                    px: 1,
                    mb: 2,
                }}
            >
                {(data?.messages || []).map((msg) => {
                    const isOwn = msg.userId === currentUser?.userId;
                    const isSystem = msg.userId === 'SYSTEM';

                    if (isSystem) {
                        return (
                            <Box key={msg.messageId} sx={{ textAlign: 'center', py: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {msg.content}
                                </Typography>
                            </Box>
                        );
                    }

                    return (
                        <Box
                            key={msg.messageId}
                            sx={{
                                display: 'flex',
                                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <Paper
                                sx={{
                                    px: 2,
                                    py: 1,
                                    maxWidth: '70%',
                                    bgcolor: isOwn ? 'primary.main' : 'grey.100',
                                    color: isOwn ? 'primary.contrastText' : 'text.primary',
                                }}
                            >
                                {!isOwn && (
                                    <Typography variant="caption" fontWeight="bold" display="block">
                                        {msg.sender?.displayName || msg.sender?.firstName || 'Unknown'}
                                    </Typography>
                                )}
                                <Typography variant="body2">{msg.content}</Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        opacity: 0.7,
                                        display: 'block',
                                        textAlign: 'right',
                                        mt: 0.5,
                                    }}
                                >
                                    {dayjs(msg.createdAt).format('HH:mm')}
                                </Typography>
                            </Paper>
                        </Box>
                    );
                })}
            </Box>

            {/* Input */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder={t('messages.typeMessage')}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={sendMessage.isPending}
                />
                <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!messageText.trim() || sendMessage.isPending}
                >
                    <Send />
                </IconButton>
            </Box>
        </Box>
    );
}
