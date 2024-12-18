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
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  currentUserID: string = 'N/A';

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUserID = this.userService.getCurrentUserId() || 'N/A';
    this.fetchConversations();
  }

  fetchConversations(): void {
    this.chatService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        console.log('Fetched conversations:', this.conversations);
      },
      error: (err) => console.error('Error fetching conversations:', err),
    });
  }

  onConversationSelected(conversation: Conversation): void {
    this.selectedConversation = conversation;

    const conversationIndex = this.conversations.findIndex(
      (c) => c._id === conversation._id
    );

    if (conversationIndex !== -1) {
      this.conversations[conversationIndex] = { ...conversation };
    }
  }

  onMessageSent(content: string): void {
    if (!this.selectedConversation) {
      console.error('No conversation selected.');
      return;
    }

    const receiverID = this.selectedConversation.participants.find(
      (p) => p._id !== this.currentUserID
    )?._id;

    if (!receiverID) {
      console.error('Invalid conversation participants.');
      return;
    }

    this.chatService.sendMessage(receiverID, content).subscribe({
      next: (newMessage) => {
        this.selectedConversation?.messages.push(newMessage);
        this.selectedConversation!.lastMessage = newMessage;
      },
      error: (err) => console.error('Error sending message:', err),
    });
  }
}
