import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChatMessage } from '../chat.model';
import { CustomDatePipe } from '../../ads/ad-details/custom.date.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CustomDatePipe, FormsModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent {
  @Input() conversation: ChatMessage[] = []; // The selected conversation
  @Input() currentUserID: string = ''; // Current logged-in user's ID
  @Output() messageSent = new EventEmitter<string>();
  newMessage: string = '';

  sendMessage(messageContent: string): void {
    if (messageContent.trim()) {
      this.messageSent.emit(messageContent.trim());
    }
  }
}
