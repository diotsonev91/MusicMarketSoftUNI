import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ChatMessage } from '../chat.model';
import { CustomDatePipe } from '../../ads/ad-details/custom.date.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [CustomDatePipe],
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnChanges {
  @Input() messages: ChatMessage[] = []; // All messages
  @Input() currentUserID: string = ''; // Current user's ID
  @Output() conversationSelected = new EventEmitter<ChatMessage[]>(); // Emit the selected conversation

  conversations: { user: string; lastMessage: ChatMessage; messages: ChatMessage[] }[] = []; // Grouped conversations
  selectedConversationUser: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      this.groupMessagesByConversation();
    }
  }

  /**
   * Group messages into conversations and pick the last message for each conversation.
   */
  groupMessagesByConversation(): void {
    const conversationMap: Map<string, ChatMessage[]> = new Map();

    this.messages.forEach((message) => {
      const otherUser =
        message.senderID._id === this.currentUserID
          ? message.receiverID._id
          : message.senderID._id;

      if (!conversationMap.has(otherUser)) {
        conversationMap.set(otherUser, []);
      }

      conversationMap.get(otherUser)?.push(message);
    });

    this.conversations = Array.from(conversationMap.entries()).map(([user, messages]) => {
      // Sort messages by timestamp in descending order
      const sortedMessages = messages.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      return {
        user,
        lastMessage: sortedMessages[0], // Pick the last message for preview
        messages: sortedMessages,
      };
    });
  }

  /**
   * Handle conversation selection.
   */
  selectConversation(conversation: { user: string; messages: ChatMessage[] }): void {
    this.selectedConversationUser = conversation.user;
    this.conversationSelected.emit(conversation.messages);

    // Mark all messages in the conversation as viewed
    this.markMessagesAsViewed(conversation.messages);
  }

  /**
   * Mark messages in a conversation as viewed.
   */
  markMessagesAsViewed(conversationMessages: ChatMessage[]): void {
    conversationMessages.forEach((message) => {
      if (!message.viewed && message.receiverID._id === this.currentUserID) {
        message.viewed = true;
      }
    });
  }
}
