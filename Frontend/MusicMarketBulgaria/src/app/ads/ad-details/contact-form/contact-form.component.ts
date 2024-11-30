import { Component, Input } from '@angular/core';
import { ChatService } from '../../../chat/chat.service';
import { AdData } from '../../ad-data.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [],
  templateUrl: './contact-form.component.html',
  styleUrls: ['../shared.css','./contact-form.component.css']
})
export class ContactFormComponent {

  constructor( private chatService: ChatService){
    
  }
  @Input() ad: AdData | null = null;
  messageContent: string = '';
  sendMessage(): void {
    if (!this.messageContent.trim()) {
      console.error('Message content is empty');
      return;
    }

    if (!this.ad?.user) {
      console.error('Ad details are incomplete. Cannot send the message.');
      return;
    }

    this.chatService.sendMessage(this.ad.user, this.messageContent).subscribe({
      next: (response) => {
        console.log('Message sent successfully:', response);
        this.messageContent = '';
      },
      error: (err) => {
        console.error('Failed to send message:', err);
      },
    });
  }
}
