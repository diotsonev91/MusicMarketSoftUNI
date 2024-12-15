import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChatService } from '../../../chat/chat.service';
import { AdData } from '../../ad-data.model';
import { UserStoreService } from '../../../core/user-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  templateUrl: './contact-form.component.html',
  styleUrls: ['../shared.css', './contact-form.component.css'],
})
export class ContactFormComponent implements OnChanges {
  @Input() ad: AdData | null = null;
  showForm: boolean = true; // Controls the visibility of the form

  constructor(
    private chatService: ChatService,
    private userStoreService: UserStoreService,
    private router: Router 
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ad'] && this.ad) {
      const currentUserId = this.userStoreService.getCurrentUserId(); // Directly retrieve the user ID
      
      if (currentUserId === this.ad.userId) {
        this.showForm = false; // Hide the form if the user is the same
        console.log("SHOWD BE HIDDEN THE CONTACTY FORM")
      } else {
        this.showForm = true; // Show the form otherwise
      }
    }
  }

  navigateToEditAd(): void {
    if (this.ad?._id) {
      this.router.navigate(['/edit-ad', this.ad._id]); // Navigate to the edit-ad route
    } else {
      console.error('Ad ID is missing. Cannot navigate to edit page.');
    }
  }

  sendMessage(messageContent: string): void {
    if (!messageContent.trim()) {
      console.error('Message content is empty');
      return;
    }

    if (!this.ad?.user) {
      console.error('Ad details are incomplete. Cannot send the message.');
      return;
    }

    this.chatService.sendMessage(this.ad.user, messageContent).subscribe({
      next: (response) => {
        console.log('Message sent successfully:', response);
      },
      error: (err) => {
        console.error('Failed to send message:', err);
      },
    });
  }
}
