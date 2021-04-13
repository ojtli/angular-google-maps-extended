import {Directive, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';

import {GoogleMapsAPIWrapper} from '../services/google-maps-api-wrapper';

declare let google: any;

@Directive({
    selector: 'agm-route'
})
export class AgmRoute implements OnInit, OnChanges, OnDestroy {
    @Input() nodes: string[] | google.maps.LatLng[] | google.maps.LatLngLiteral[] | google.maps.Place[];
    @Input() optimized = false;
    @Input() info;
    @Input() model;
    @Input() display;
    @Input() strokeColor;
    @Input() avoidHighways?: boolean

    directionsDisplay: google.maps.DirectionsRenderer;

    @Output() displayed: EventEmitter<google.maps.DirectionsResult> = new EventEmitter<google.maps.DirectionsResult>();
    @Output() dragged: EventEmitter<google.maps.DirectionsResult> = new EventEmitter<google.maps.DirectionsResult>();

    constructor(private gmapsApi: GoogleMapsAPIWrapper) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.nodes && this.nodes.length > 25) {
            alert('Google does not allow more than 25 points by route.');
            return;
        }
        if (!!this.directionsDisplay) {
            this.directionsDisplay.setMap(null); // reset route
        }

        this.gmapsApi.getNativeMap().then(map => {
            const directionsService = new google.maps.DirectionsService;
            this.directionsDisplay = new google.maps.DirectionsRenderer({
              draggable: true,
              map: map,
            });
          this.directionsDisplay.addListener('directions_changed', () => {
            this.dragged.emit(this.directionsDisplay.getDirections());
          });
            if (!!this.nodes) {
              const [first, ...others] = this.nodes;
              // ;
              const options: google.maps.DirectionsRequest = {
                origin: first,
                destination: this.nodes[this.nodes.length - 1],
                optimizeWaypoints: this.optimized,
                // strokeColor: this.strokeColor,
                travelMode: google.maps.TravelMode.DRIVING,
                avoidHighways: this.avoidHighways,
                region: 'ni',
              };
              if (this.nodes.length > 2) {
                const [last, ...middle] = others.reverse();
                options.waypoints = middle.reverse() // reverse back because it needs to keep the positions
                  .map((item) => ({
                      location: item as google.maps.LatLng,
                      stopover: true,
                    }));
              }
              if (!!options.origin) {
                  directionsService.route(options, (response, status) => {
                      if (status === google.maps.DirectionsStatus.OK) {
                          this.directionsDisplay.setDirections(response);
                          this.displayed.emit(response);
                          // this.computeTotalDistance(response);
                          if (!!this.model) {
                              this.model.directionResult = response;
                          }

                      } else {
                          window.alert('Directions request failed due to ' + status);
                      }
                  });
              }

            } else if (!!this.display) {
                this.directionsDisplay.setDirections(this.display);
            }
        });
    }

    ngOnDestroy() {
      if (this.directionsDisplay) {
        this.directionsDisplay.setMap(null);
      }
    }
}
