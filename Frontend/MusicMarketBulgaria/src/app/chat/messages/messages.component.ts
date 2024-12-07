import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Conversation } from '../conversation.model';
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
  conversations: Conversation[] = []; // All conversations
  selectedConversation: Conversation | null = null; // Selected conversation
  currentUserID: string = ''; // Current user's ID

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUserID = this.userService.getCurrentUserId() || '';
    this.fetchConversations();
  }

  /**
   * Fetch conversations from the backend
   */
  fetchConversations(): void {
    this.chatService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        console.log('Fetched conversations:', this.conversations);
      },
      error: (err) => console.error('Error fetching conversations:', err),
    });
  }

  /**
   * Handles conversation selection from the sidebar
   */
  onConversationSelected(conversation: Conversation): void {
    this.selectedConversation = conversation;

    // Optionally, you can mark unread messages as viewed here if required
  }

  /**
   * Handles sending a new message
   */
  onMessageSent(content: string): void {
    if (!this.selectedConversation) {
      console.error('No conversation selected.');
      return;
    }

    const receiverID = this.selectedConversation.participant._id;

    this.chatService.sendMessage(receiverID, content).subscribe({
      next: (newMessage) => {
        this.selectedConversation?.messages.push(newMessage);
        this.selectedConversation!.lastMessage = newMessage;
      },
      error: (err) => console.error('Error sending message:', err),
    });
  }
}
