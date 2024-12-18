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
  currentUserId: string | null = null; // Stores the current user ID
  isNotLoggedUser: boolean = false;
  constructor(
    private chatService: ChatService,
    private userStoreService: UserStoreService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ad'] && this.ad) {
      // Fetch the current user ID asynchronously
      this.userStoreService.getCurrentUserIdAsync().subscribe((id) => {
        this.currentUserId = id;
        if (this.currentUserId == null) {
          this.isNotLoggedUser = true;
        }
        if (this.currentUserId === this.ad?.userId) {
          // Compare current user ID with the ad owner ID
          this.showForm = false; // Hide the form if the user is the ad owner
          //console.log(
          //'Contact form should be hidden for the ad owner '
          //);
        } else {
          this.showForm = true; // Show the form otherwise
        }
      });
    }
  }

  ngOnSubmit() {}
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
