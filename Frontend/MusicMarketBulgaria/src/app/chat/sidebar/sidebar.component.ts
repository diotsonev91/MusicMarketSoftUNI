import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { Conversation } from '../conversation.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() conversations: Conversation[] = [];
  @Input() currentUserID: string = '';
  @Output() conversationSelected = new EventEmitter<Conversation>();

  selectedConversationUser: string | null = null;
  showUnreadOnly: boolean = false;
  filteredConversations: Conversation[] = [];

  constructor(private chatService: ChatService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversations']) {
      this.updateFilteredConversations();
    }
  }

  updateFilteredConversations(): void {
    this.filteredConversations = this.conversations.filter((conversation) => {
      const readState = conversation.readStates?.find(
        (state) => state.participantId === this.currentUserID
      );
      return this.showUnreadOnly ? readState!.unreadCount > 0 : true;
    });
  }

  toggleFilter(showUnread: boolean): void {
    this.showUnreadOnly = showUnread;
    this.updateFilteredConversations();
  }

  selectConversation(conversation: Conversation): void {
    this.chatService.markAsRead(conversation._id).subscribe(() => {
      const readState = conversation.readStates.find(
        (state) => state.participantId === this.currentUserID
      );

      if (readState) {
        readState.unreadCount = 0;
        this.updateFilteredConversations();
      }

      this.conversationSelected.emit(conversation);
    });
  }

  getUnreadCount(conversation: Conversation): number {
    const readState = conversation.readStates.find(
      (state) => state.participantId === this.currentUserID
    );
    return readState?.unreadCount ?? 0;
  }

  trackByConversationId(index: number, conversation: Conversation): string {
    return conversation._id;
  }
}
