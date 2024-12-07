import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { Conversation } from '../conversation.model';
import { CustomDatePipe } from '../../ads/ad-details/custom.date.pipe';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversations']) {
      this.updateFilteredConversations();
    }
  }

  /**
   * Update the filtered conversations based on the filter state.
   */
  updateFilteredConversations(): void {
    if (this.showUnreadOnly) {
      this.filteredConversations = this.conversations.filter(
        (conversation) => conversation.unreadCount && conversation.unreadCount > 0
      );
    } else {
      this.filteredConversations = this.conversations;
    }
  }

  /**
   * Toggle between showing all conversations and unread-only.
   */
  toggleFilter(showUnread: boolean): void {
    this.showUnreadOnly = showUnread;
    this.updateFilteredConversations();
  }

  /**
   * Handle selection of a conversation.
   */
  selectConversation(conversation: Conversation): void {
    this.selectedConversationUser = conversation.participant._id;
    this.conversationSelected.emit(conversation);
  }
}
