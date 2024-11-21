export interface ChatMessage {
    _id?: string;
    senderID: string;
    receiverID: string;
    content: string;
    timestamp: Date;
    viewed?: boolean;
    replied?: boolean;
  }