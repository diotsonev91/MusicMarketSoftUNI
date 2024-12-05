import { Component } from '@angular/core';
import { AdsViewHomeComponent } from '../../ads/ads-view-home/ads-view-home.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AdsViewHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
