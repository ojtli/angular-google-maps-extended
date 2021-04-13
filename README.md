# AGMX - Angular components for Google Maps eXtended

This project is a fork of the core module of [Angular components for Google Maps](https://github.com/SebastianM/angular-google-maps) 
and as such most of the components are still compatible with the [original documentation](https://angular-maps.com/api-docs/agm-core/modules/agmcoremodule)

The differences are:

## Types based `@types/googlemaps`
The original project relied on custom definitions of the types of the google maps javascript sdk, but in this project all the type definitions are based on @types/googlempas which is a more maintained and more complete set of definitions.


## Search Box Component `<agm-search-box></agm-search-box>`

```
/**
 * Placeholder for the search box input
 */
@Input() placeholder: string;
/**
 * Position in which the control is going to placed
 * This input is required otherwise the box won't be added to the map
 */
@Input() position: google.maps.ControlPosition;
/**
 * Will automatically center the map to the clicked result
 */
@Input() autoBoundResults: boolean = true;
/**
 * The area towards which to bias query predictions. Predictions are biased towards, but not restricted to, queries targeting these bounds.
 */
@Input() bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
/**
 * This event is fired when the user selects a query, will return the places matching that query.
 */
@Output() placesChange: EventEmitter<Array<google.maps.places.PlaceResult>> = new EventEmitter<Array<google.maps.places.PlaceResult>>();
```

## Custom Control Component

```
<agm-control [position]="position">
  <div content>
      <!-- my markup -->
  </div>
</agm-control>
```

## Routes Component `<agm-route [nodes]="nodes"></agm-route>`

Implementation of [Directions Service](https://developers.google.com/maps/documentation/javascript/directions)

`<agm-route [nodes]="nodes"></agm-route>`

### Run Demo: 

Update your api key at `projects/demos/src/environments/environment.ts`

`npm install`

`npm run build:agmx`

`npm start`

### This project is used in the following sites [https://ojtli.app](https://ojtli.app), [https://salud.ojtli.app](https://salud.ojtli.app)
