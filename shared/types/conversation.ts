export enum ConversationType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
  LEAGUE = 'LEAGUE',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  SYSTEM = 'SYSTEM',
}

export interface Conversation {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  conversationId: string;
  leagueId?: string;
  type: ConversationType;
  participants: string[];
  name?: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface ChatMessage {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  messageId: string;
  conversationId: string;
  userId: string;
  content: string;
  type: MessageType;
  createdAt: string;
}
