import { ChatMessage } from "./chat.model";

export interface Conversation {
  participant: {
    _id: string;
    username: string;
  }; 
  messages: ChatMessage[];
  lastMessage?: ChatMessage; 
  unreadCount?: number; 
}