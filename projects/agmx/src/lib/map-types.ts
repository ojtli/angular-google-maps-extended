import {LatLngLiteral} from './services/google-maps-types';

// exported map types
export {
  KmlMouseEvent,
  DataMouseEvent,
  LatLngBounds,
  LatLngBoundsLiteral,
  LatLng,
  LatLngLiteral,
  PolyMouseEvent,
  MarkerLabel,
  Geocoder,
  GeocoderAddressComponent,
  GeocoderComponentRestrictions,
  GeocoderGeometry,
  GeocoderLocationType,
  GeocoderRequest,
  GeocoderResult,
  GeocoderStatus,
  MapTypeStyle,
  Padding,
  OverviewMapControlOptions,
  PanControlOptions,
  RotateControlOptions,
  MapTypeControlOptions,
  MapTypeId,
  ScaleControlOptions,
  ScaleControlStyle,
  StreetViewControlOptions,
  ZoomControlOptions,
  ZoomControlStyle,
  FullscreenControlOptions,
  CircleOptions,
  Circle,
  Polyline,
  PolylineOptions,
  Polygon,
  PolygonOptions,
  Rectangle,
  RectangleOptions,
  Marker,
  MarkerOptions,
} from './services/google-maps-types';

export {PolygonPathEvent} from './directives/polygon';

/**
 * MouseEvent gets emitted when the user triggers mouse events on the map.
 */
export interface MouseEvent {
  coords: LatLngLiteral;
  placeId?: string;
}
