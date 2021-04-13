import { Injectable, NgZone } from '@angular/core';
import { Observable ,  Observer } from 'rxjs';

import { AgmDataLayer } from '../../directives/data-layer';
import {ExtendedData, GoogleMapsAPIWrapper} from '../google-maps-api-wrapper';

declare var google: any;

/**
 * Manages all Data Layers for a Google Map instance.
 */
@Injectable({
  providedIn: 'root'
})
export class DataLayerManager {
  private _layers: Map<AgmDataLayer, Promise<ExtendedData>> =
  new Map<AgmDataLayer, Promise<ExtendedData>>();

  constructor(private _wrapper: GoogleMapsAPIWrapper, private _zone: NgZone) { }

  /**
   * Adds a new Data Layer to the map.
   */
  addDataLayer(layer: AgmDataLayer) {
    const newLayer = this._wrapper.createDataLayer(<google.maps.Data.DataOptions>{
      style: layer.style
    })
    .then(d => {
      if (layer.geoJson) {
        this.getDataFeatures(d, layer.geoJson).then(features => d.features = features);
      }
      return d;
    });
    this._layers.set(layer, newLayer);
  }

  deleteDataLayer(layer: AgmDataLayer) {
    this._layers.get(layer).then(l => {
      l.setMap(null);
      this._layers.delete(layer);
    });
  }

  updateGeoJson(layer: AgmDataLayer, geoJson: Object | string) {
    this._layers.get(layer).then(l => {
      l.forEach(function (feature: google.maps.Data.Feature) {
        l.remove(feature);

        var index = l.features.indexOf(feature, 0);
        if (index > -1) {
          l.features.splice(index, 1);
        }
      });
      this.getDataFeatures(l, geoJson).then(features => l.features = features);
    });
  }

  setDataOptions(layer: AgmDataLayer, options: google.maps.Data.DataOptions)
  {
    this._layers.get(layer).then(l => {
      l.setControlPosition(options.controlPosition);
      l.setControls(options.controls);
      l.setDrawingMode(options.drawingMode);
      l.setStyle(options.style);
    });
  }

  /**
   * Creates a Google Maps event listener for the given DataLayer as an Observable
   */
  createEventObservable<T>(eventName: string, layer: AgmDataLayer): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      this._layers.get(layer).then((d: google.maps.Data) => {
        d.addListener(eventName, (e: T) => this._zone.run(() => observer.next(e)));
      });
    });
  }

  /**
   * Extract features from a geoJson using google.maps Data Class
   * @param d : google.maps.Data class instance
   * @param geoJson : url or geojson object
   */
  getDataFeatures(d: google.maps.Data, geoJson: Object | string): Promise<google.maps.Data.Feature[]> {
    return new Promise<google.maps.Data.Feature[]>((resolve, reject) => {
        if (typeof geoJson === 'object') {
          try {
            const features = d.addGeoJson(geoJson);
            resolve(features);
          } catch (e) {
            reject(e);
          }
        } else if (typeof geoJson === 'string') {
          d.loadGeoJson(geoJson, null, resolve);
        } else {
          reject(`Impossible to extract features from geoJson: wrong argument type`);
        }
      });
  }
}
