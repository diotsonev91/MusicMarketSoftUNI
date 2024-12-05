import { UserData } from "../user/user-data.model";

export interface ChatMessage {
    _id?: string;
    senderID: UserData;
    receiverID: UserData
    content: string;
    timestamp: Date;
    viewed?: boolean;
    replied?: boolean;
  }