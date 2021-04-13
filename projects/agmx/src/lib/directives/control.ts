import {Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {GoogleMapsAPIWrapper} from '../services/google-maps-api-wrapper';

/**
 * AgmxMapControl allows to add a custom control to the map
 *
 * See [Positioning Custom Controls]{@link https://developers.google.com/maps/documentation/javascript/controls?hl=en#CustomPositioning}
 *
 * ### Example
 *
 * ```
 * <agm-control [position]="position">
 *   <div content>
 *       <!-- my markup -->
 *   </div>
 * </agm-control>
 * ```
 *
 */
@Component({
  selector: 'agm-control',
  template: '<ng-content select="[content]"></ng-content>',
})
export class AgmControl implements OnChanges {
  /**
   *  Position of the control
   */
  @Input() position: google.maps.ControlPosition;

  constructor(private elm: ElementRef, private _mapsWrapper: GoogleMapsAPIWrapper) {}

  /* @internal */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['position'] && this.position) {
      this._mapsWrapper.getControls().then((controls: google.maps.MVCArray<Node>[]) => {
        const index = this.getElementIndex(controls, changes);
        if (index !== null) {
          controls[changes['position'].previousValue].removeAt(index);
        }

        controls[this.position].push(this.elm.nativeElement);
      });
    } else if (changes['position'] && changes['position'].currentValue === null && changes['position'].previousValue !== null) {
      this._mapsWrapper.getControls().then((controls: google.maps.MVCArray<Node>[]) => {
        const index = this.getElementIndex(controls, changes);
        if (index !== null) {
          controls[changes['position'].previousValue].removeAt(index);
        }
      });
    }
  }

  private getElementIndex(controls: google.maps.MVCArray<Node>[], changes: SimpleChanges) {
    if (!controls[changes['position'].previousValue]) {
      return null;
    }
    let index = null;
    controls[changes['position'].previousValue].forEach((elem, i) => {
      if (elem === this.elm.nativeElement) {
        index = i;
        return null;
      }
    });
    return index;
  }
}
