import {Injectable, NgZone} from '@angular/core';
import {Observable, Observer} from 'rxjs';

import * as mapTypes from './google-maps-types';
import {MapsAPILoader} from './maps-api-loader/maps-api-loader';
import {GoogleMap} from './google-maps-types';

// todo: add types for this
declare var google: any;

interface ExtendedMapOptions extends google.maps.MapOptions {
  mapId: string;
}

export interface ExtendedData extends google.maps.Data {
  features: google.maps.Data.Feature[];
}

/**
 * Wrapper class that handles the communication with the Google Maps Javascript
 * API v3
 */
@Injectable({
  providedIn: 'root'
})
export class GoogleMapsAPIWrapper {
  private readonly _map: Promise<mapTypes.GoogleMap | google.maps.Map>;
  private _mapResolver: (value?: mapTypes.GoogleMap) => void;

  constructor(private _loader: MapsAPILoader, private _zone: NgZone) {
    this._map =
        // new Promise<mapTypes.GoogleMap>((resolve: () => void) => { this._mapResolver = resolve; });
        new Promise<mapTypes.GoogleMap>((resolve: (value: GoogleMap<Element> | PromiseLike<GoogleMap<Element>>) => void, reject: (reason?: any) => void) => { this._mapResolver = resolve; });
  }

  createMap(el: HTMLElement, mapOptions: google.maps.MapOptions | ExtendedMapOptions): Promise<void> {
    return this._zone.runOutsideAngular( () => {
      return this._loader.load().then(() => {
        const map = new google.maps.Map(el, mapOptions);
        this._mapResolver(<mapTypes.GoogleMap>map);
        return;
      });
    });
  }

  setMapOptions(options: mapTypes.MapOptions) {
    return this._zone.runOutsideAngular(() => {
      this._map.then((m: mapTypes.GoogleMap) => { m.setOptions(options); });
    });
  }

  /**
   * Creates a google map marker with the map context
   */
  createMarker(options: google.maps.MarkerOptions = <google.maps.MarkerOptions>{}, addToMap: boolean = true):
      Promise<google.maps.Marker> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => {
        if (addToMap) {
          options.map = map as google.maps.Map;
        }
        return new google.maps.Marker(options);
      });
    });
  }

  createInfoWindow(options?: google.maps.InfoWindowOptions): Promise<google.maps.InfoWindow> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then(() => new google.maps.InfoWindow(options));
    });
  }

  /**
   * Creates a google.map.Circle for the current map.
   */
  createCircle(options: mapTypes.CircleOptions): Promise<google.maps.Circle> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => {
        if (typeof options.strokePosition === 'string') {
          options.strokePosition = google.maps.StrokePosition[options.strokePosition];
        }
        options.map = map;
        return new google.maps.Circle(options);
      });
    });
  }

  /**
   * Creates a google.map.Rectangle for the current map.
   */
  createRectangle(options: mapTypes.RectangleOptions): Promise<google.maps.Rectangle> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => {
        options.map = map;
        return new google.maps.Rectangle(options);
      });
    });
  }

  createPolyline(options: google.maps.PolylineOptions): Promise<google.maps.Polyline> {
    return this._zone.runOutsideAngular(() => {
      return this.getNativeMap().then((map: mapTypes.GoogleMap) => {
        const line = new google.maps.Polyline(options);
        line.setMap(map);
        return line;
      });
    });
  }

  createPolygon(options: google.maps.PolygonOptions): Promise<google.maps.Polygon> {
    return this._zone.runOutsideAngular(() => {
      return this.getNativeMap().then((map: mapTypes.GoogleMap) => {
        const polygon = new google.maps.Polygon(options);
        polygon.setMap(map);
        return polygon;
      });
    });
  }

  /**
   * Creates a new google.map.Data layer for the current map
   */
  createDataLayer(options?: google.maps.Data.DataOptions): Promise<ExtendedData> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then(m => {
        const data = new google.maps.Data(options);
        data.setMap(m);
        return data;
      });
    });
  }

  /**
   * Creates a TransitLayer instance for a map
   * @param options
   */
  /* @param {TransitLayerOptions} options - used for setting layer options
   * @returns {Promise<TransitLayer>} a new transit layer object
   */
  createTransitLayer(options: mapTypes.TransitLayerOptions): Promise<google.maps.TransitLayer>{
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => {
        const newLayer: google.maps.TransitLayer = new google.maps.TransitLayer();
        newLayer.setMap(options.visible ? map as unknown as google.maps.Map : null);
        return newLayer;
      });
    });
  }

  /**
   * Creates a BicyclingLayer instance for a map
   * @param options
   */
  /* @param {BicyclingLayerOptions} options - used for setting layer options
  * @returns {Promise<BicyclingLayer>} a new bicycling layer object
  */
  createBicyclingLayer(options: mapTypes.BicyclingLayerOptions): Promise<google.maps.BicyclingLayer>{
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => {
        const newLayer: google.maps.BicyclingLayer = new google.maps.BicyclingLayer();
        newLayer.setMap(options.visible ? map as unknown as google.maps.Map : null);
        return newLayer;
      });
    });
  }

  /**
   * Determines if given coordinates are insite a Polygon path.
   */
  containsLocation(latLng: google.maps.LatLngLiteral, polygon: google.maps.Polygon): Promise<boolean> {
    return google.maps.geometry.poly.containsLocation(latLng, polygon);
  }

  subscribeToMapEvent<E>(eventName: string): Observable<E> {
    return new Observable((observer: Observer<E>) => {
      this._map.then((m: mapTypes.GoogleMap) => {
        m.addListener(eventName, (arg: E) => { this._zone.run(() => observer.next(arg)); });
      });
    });
  }

  clearInstanceListeners() {
    return this._zone.runOutsideAngular(() => {
      this._map.then((map: mapTypes.GoogleMap) => {
        google.maps.event.clearInstanceListeners(map);
      });
    });
  }

  setCenter(latLng: google.maps.LatLngLiteral): Promise<void> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => map.setCenter(latLng));
    });
  }

  getZoom(): Promise<number> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => map.getZoom());
    });
  }

  getBounds(): Promise<google.maps.LatLngBounds> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => map.getBounds());
    });
  }

  getMapTypeId(): Promise<google.maps.MapTypeId> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => map.getMapTypeId());
    });
  }

  setZoom(zoom: number): Promise<void> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => map.setZoom(zoom));
    });
  }

  getCenter(): Promise<google.maps.LatLng> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => map.getCenter());
    });
  }

  getControls(): Promise<google.maps.MVCArray<Node>[]> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => map.controls);
    });
  }

  panTo(latLng: google.maps.LatLng|google.maps.LatLngLiteral): Promise<void> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => map.panTo(latLng));
    });
  }

  panBy(x: number, y: number): Promise<void> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map) => map.panBy(x, y));
    });
  }

  fitBounds(latLng: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral, padding?: number | google.maps.Padding): Promise<void> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => map.fitBounds(latLng, padding));
    });
  }

  panToBounds(latLng: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral, padding?: number | google.maps.Padding): Promise<void> {
    return this._zone.runOutsideAngular(() => {
      return this._map.then((map: mapTypes.GoogleMap) => map.panToBounds(latLng, padding));
    });
  }

  /**
   * Returns the native Google Maps Map instance. Be careful when using this instance directly.
   */
  getNativeMap(): Promise<mapTypes.GoogleMap> { return this._map as Promise<mapTypes.GoogleMap>; }

  /**
   * Returns the native Google Maps Map instance. Be careful when using this instance directly.
   */
  getTrueNativeMap(): Promise<google.maps.Map> { return this._map as Promise<google.maps.Map>; }

  /**
   * Triggers the given event name on the map instance.
   */
  triggerMapEvent(eventName: string): Promise<void> {
    return this._map.then((m) => google.maps.event.trigger(m, eventName));
  }
}
