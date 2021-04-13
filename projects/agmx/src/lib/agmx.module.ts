import {ModuleWithProviders, NgModule} from '@angular/core';
// import {AgmxMap} from './directives/map';
import {AgmCircle} from './directives/circle';
import {AgmInfoWindow} from './directives/info-window';
import {AgmMarker} from './directives/marker';
import {AgmPolygon} from './directives/polygon';
import {AgmPolyline} from './directives/polyline';
import {AgmKmlLayer} from './directives/kml-layer';
import {AgmDataLayer} from './directives/data-layer';
import {AgmSearchBox} from './directives/search-box';
import {AgmControl} from './directives/control';
import {AgmxMap} from './directives/map';
import {AgmRoute} from './directives/route';
import { AgmPolylineIcon } from './directives/polyline-icon';
import { AgmPolylinePoint } from './directives/polyline-point';
import { AgmRectangle } from './directives/rectangle';
import { AgmTransitLayer } from './directives/transit-layer';
import {AgmFitBounds} from './directives/fit-bounds';
import {AgmBicyclingLayer} from './directives/bicycling-layer';

import {LazyMapsAPILoader} from './services/maps-api-loader/lazy-maps-api-loader';
import {LAZY_MAPS_API_CONFIG, LazyMapsAPILoaderConfigLiteral} from './services/maps-api-loader/lazy-maps-api-loader';
import {MapsAPILoader} from './services/maps-api-loader/maps-api-loader';
import {BROWSER_GLOBALS_PROVIDERS} from './utils/browser-globals';


/**
 * The agmx module. Contains all Directives/Services/Pipes
 * of the core module. Please use `AgmxModule.forRoot()` in your app module.
 */
@NgModule({declarations: [
      AgmxMap, AgmMarker, AgmInfoWindow, AgmCircle,
      AgmPolygon, AgmPolyline, AgmPolylinePoint, AgmKmlLayer,
      AgmDataLayer, AgmPolylinePoint, AgmPolylineIcon, AgmRectangle, AgmTransitLayer,
      AgmBicyclingLayer, AgmFitBounds,
      AgmSearchBox, AgmControl, AgmRoute
    ],
    exports: [
      AgmxMap, AgmMarker, AgmInfoWindow, AgmCircle,
      AgmPolygon, AgmPolyline, AgmPolylinePoint, AgmKmlLayer,
      AgmDataLayer, AgmPolylinePoint, AgmPolylineIcon, AgmRectangle, AgmTransitLayer,
      AgmBicyclingLayer, AgmFitBounds,
      AgmSearchBox, AgmControl, AgmRoute
    ],
  }
)
export class AgmxModule {
  /**
   * Please use this method when you register the module at the root level.
   */
  static forRoot(lazyMapsAPILoaderConfig?: LazyMapsAPILoaderConfigLiteral): ModuleWithProviders<AgmxModule> {
    return {
      ngModule: AgmxModule,
      providers: [
        ...BROWSER_GLOBALS_PROVIDERS,
        {provide: MapsAPILoader, useClass: LazyMapsAPILoader},
        {provide: LAZY_MAPS_API_CONFIG, useValue: lazyMapsAPILoaderConfig}
      ],
    };
  }
}
