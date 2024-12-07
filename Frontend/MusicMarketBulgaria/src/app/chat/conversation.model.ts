import { ChatMessage } from './chat.model';

export interface Conversation {
  _id: string; // Unique ID for the conversation
  createdAt: Date; // Timestamp for when the conversation was created
  participants: { // Array of participants in the conversation
    _id: string; // Participant's ID
    username: string; // Participant's username
  }[];
  messages: ChatMessage[]; // Array of messages in the conversation
  lastMessage?: ChatMessage; // Optional: The most recent message in the conversation
  readStates: { // Array of read states for participants
    participantId: string; // Participant's ID
    unreadCount: number; // Number of unread messages for this participant
  }[];
}
