import {ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {GoogleApisService} from './google-apis.service';

declare const gapi;

const CLIENT_ID = '122298603879-j0h2e3tb112t7j2aucpg9nc50kjlb37e.apps.googleusercontent.com';

interface DataRow {
  place: string;
  address: string;
  latMeta: number;
  lngMeta: number;
  latOjtli: number;
  lngOjtli:number;
  delta?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demos';
  latlngBounds: google.maps.LatLngBounds;
  center = {lat: 12.129208234908715, lng: -86.26639924943447};
  values: DataRow[];
  selectedItem: DataRow;
  spreadsheetId = '1STDTaTzaRuXzQYB8f12cgzZ8Zu0LwDn5tgXIvOPVVJQ';
  selectedIndex: number;
  searchPosition: google.maps.ControlPosition;
  panelPosition: google.maps.ControlPosition;
  NICARAGUA = {
    north: 15.5,
    south: 10.7,
    east: -83.10,
    west: -87.7
  };
  places = [
    {name: 'Hospital Metropolitano Vivian Pellas', pos: {lat: 12.086061, lng: -86.233321}, },
    {name: 'Hospital Bautista', pos: {lat: 12.141973, lng: -86.263196}, },
    {name: 'Hospital Monte España', pos: {lat: 12.114746, lng: -86.265319}, },
    {name: 'Hospital Salud Integral', pos: {lat: 12.148312, lng: -86.289012}, },
    {name: 'Hospital Su Médico', pos: {lat: 12.139631, lng: -86.282952}, },
  ]
  nodes: google.maps.LatLng[];

  constructor(private ngZone: NgZone, private googleApi: GoogleApisService,
                private detector: ChangeDetectorRef,) { }

  ngOnInit(): void {

  }

  initializeControls($event: any) {
    this.searchPosition = google.maps.ControlPosition.TOP_LEFT;
    this.panelPosition = google.maps.ControlPosition.LEFT_CENTER;
    this.nodes = this.places.map(item => new google.maps.LatLng(item.pos.lat, item.pos.lng));
  }

  updateRef(places: any): void {
    if (places.length) {
      this.center = {
        lat: places[0].geometry.location.lat(),
        lng: places[0].geometry.location.lng()
      }
      this.detector.detectChanges();
    } else {
      console.log('Place not found')
    }
  }
}
