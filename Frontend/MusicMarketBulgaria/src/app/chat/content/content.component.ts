import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChatMessage } from '../chat.model';
import { CustomDatePipe } from '../../ads/ad-details/custom.date.pipe';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CustomDatePipe],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent {
  @Input() conversation: ChatMessage[] = [];
  @Input() currentUserID: string = '';
  @Output() messageSent = new EventEmitter<string>();

  sendMessage(messageContent: string): void {
    if (messageContent.trim()) {
      this.messageSent.emit(messageContent.trim());
    }
  }
}
