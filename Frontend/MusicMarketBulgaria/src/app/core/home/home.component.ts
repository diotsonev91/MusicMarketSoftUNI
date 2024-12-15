import { Component } from '@angular/core';
import { AdsViewHomeComponent } from '../../ads/ads-view-home/ads-view-home.component';
import {RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AdsViewHomeComponent, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showDescription: boolean = true; // Flag to control visibility of the description section

  closeDescription(): void {
    this.showDescription = false; // Set the flag to `false` to hide the section
  }
}
