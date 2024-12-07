import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { Conversation } from '../conversation.model';
import { CustomDatePipe } from '../../ads/ad-details/custom.date.pipe';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [CustomDatePipe],
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() conversations: Conversation[] = [];
  @Input() currentUserID: string = ''; // Current user's ID
  @Output() conversationSelected = new EventEmitter<Conversation>(); // Emit the selected conversation

  selectedConversationUser: string | null = null;
  showUnreadOnly: boolean = false; // State for filtering unread conversations
  filteredConversations: Conversation[] = []; // Conversations to display


  constructor(private chatService: ChatService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversations']) {
      this.updateFilteredConversations();
      console.log(this.conversations)
      console.log(this.showUnreadOnly)
    }
  }

  /**
   * Update the filtered conversations based on the filter state.
   */
  updateFilteredConversations(): void {
    if (this.showUnreadOnly) {
      this.filteredConversations = this.conversations.filter((conversation) => {
        // Find the current user's read state
        const currentUserReadState = conversation.readStates.find(
          (state) => state.participantId === this.currentUserID
        );
  
        // Safely check unreadCount, default to 0 if undefined
        return (currentUserReadState?.unreadCount ?? 0) > 0;
      });
    } else {
      this.filteredConversations = this.conversations;
    }
  }
  /**
   * Toggle between showing all conversations and unread-only.
   */
  toggleFilter(showUnread: boolean): void {
    this.showUnreadOnly = showUnread;
    console.log("show unreal only:", this.showUnreadOnly)
    this.updateFilteredConversations();
  }

  /**
   * Handle selection of a conversation.
   */
  selectConversation(conversation: Conversation): void {
    this.chatService.markAsRead(conversation._id).subscribe(() => {
      const currentUserReadState = conversation.readStates.find(
        (state) => state.participantId === this.currentUserID
      );
  
      // Safely reset unreadCount if currentUserReadState exists
      if (currentUserReadState) {
        currentUserReadState.unreadCount = 0;
      }
  
      this.updateFilteredConversations(); // Reapply the filter
    });
  
    this.conversationSelected.emit(conversation); // Emit the selected conversation
  }
}
