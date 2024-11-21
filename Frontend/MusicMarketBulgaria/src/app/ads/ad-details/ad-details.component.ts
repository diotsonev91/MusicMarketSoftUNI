import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdService } from '../ad.service';
import { ChatService } from '../../chat/chat.service';
import { AdData } from '../ad-data.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.css'],
})
export class AdDetailsComponent implements OnInit {
  ad: AdData | null = null;
  relatedAds: AdData[] = [];
  messageContent: string = '';
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private adService: AdService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchAdDetails(id);
      this.loadRelatedAds(id);
    }
  }

  fetchAdDetails(id: string): void {
    this.adService.getAdById(id).subscribe({
      next: (ad) => (this.ad = ad),
      error: (err) => console.error('Failed to fetch ad details:', err),
    });
  }

  loadRelatedAds(currentAdId: string): void {
    this.adService.getAllAds().subscribe({
      next: (ads) => {
        // Filter out the current ad
        this.relatedAds = ads.filter((ad) => ad._id !== currentAdId).slice(0, 4);
      },
      error: (err) => console.error('Failed to fetch related ads:', err),
    });
  }

  nextImage(): void {
    if (this.ad && this.ad.images) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.ad.images.length;
    }
  }

  previousImage(): void {
    if (this.ad && this.ad.images) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.ad.images.length) %
        this.ad.images.length;
    }
  }

  sendMessage(): void {
    if (!this.messageContent.trim()) {
      console.error('Message content is empty');
      return;
    }

    if (!this.ad?.userId) {
      console.error('Ad details are incomplete. Cannot send the message.');
      return;
    }

    this.chatService.sendMessage(this.ad.userId, this.messageContent).subscribe({
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
