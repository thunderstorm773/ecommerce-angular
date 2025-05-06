import { Component, OnInit } from '@angular/core';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-contact-us',
  standalone: false,
  
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit {

  mapInitialized = false;
  zoom = environment.mapZoom;
  center: google.maps.LatLngLiteral = { lat: environment.storeLatitude, lng: environment.storeLongitude };
  stores = [
    { name: environment.storeName, position: { lat: environment.storeLatitude, lng: environment.storeLongitude } },
  ];

  constructor(private googleMapsLoader: GoogleMapsLoaderService) { }

  async ngOnInit() {
    try {
      await this.googleMapsLoader.load();
      this.mapInitialized = true;
    } catch (error) {
      console.error('Google Maps failed to load', error);
    }
  }
}
