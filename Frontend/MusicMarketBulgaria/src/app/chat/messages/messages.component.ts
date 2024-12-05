import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { ChatMessage } from '../chat.model';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ContentComponent } from '../content/content.component';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ContentComponent, SidebarComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: ChatMessage[] = [];
  currentUserID: string = ''; // Current user's ID
  selectedConversation: ChatMessage[] = []; // Selected conversation

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUserID = this.userService.getCurrentUserId() || '';
    this.fetchMessages();
  }

  

  /**
   * Fetch all messages for the logged-in user
   */
  fetchMessages(): void {
    this.chatService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        console.log('Fetched messages:', this.messages); // Debugging line
      },
      error: (err) => console.error('Error fetching messages:', err),
    });
  }

  /**
   * Handles conversation selection from the sidebar
   */
  onConversationSelected(conversationMessages: ChatMessage[]): void {
    this.selectedConversation = conversationMessages;
  }

  /**
   * Handles message sending
   */
  onMessageSent(content: string): void {
    if (this.selectedConversation.length === 0) {
      console.error('No conversation selected.');
      return;
    }

    const receiverID =
      this.selectedConversation[0].senderID._id === this.currentUserID
        ? this.selectedConversation[0].receiverID._id
        : this.selectedConversation[0].senderID._id;

    this.chatService.sendMessage(receiverID, content).subscribe({
      next: (newMessage) => {
        this.selectedConversation.push(newMessage);
      },
      error: (err) => console.error('Error sending message:', err),
    });
  }
}
