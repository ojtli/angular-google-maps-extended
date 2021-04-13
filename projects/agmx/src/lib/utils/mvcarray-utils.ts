import { fromEventPattern, Observable } from 'rxjs';

export function createMVCEventObservable<T>(array: google.maps.MVCArray<T>): Observable<MVCEvent<T>>{
  const eventNames = ['insert_at', 'remove_at', 'set_at'];
  /*return fromEventPattern(
    (handler: Function) => eventNames.map(evName => array.addListener(evName,
      (index: number, previous?: T) => handler.apply(array, [ {'newArr': array.getArray(), evName, index, previous} as MVCEvent<T>]))),
    (_handler: Function, evListeners: google.maps.MapsEventListener[]) => evListeners.forEach(evListener => evListener.remove()));*/
  return fromEventPattern(
    (handler: Function) => eventNames.map(evName => array.addListener(evName,
      (index: number, previous?: T) => handler.apply(array, [ {'newArr': array.getArray(), evName, index, previous} as MVCEvent<T>]))),
    (_handler: Function, evListeners: google.maps.MapsEventListener[]) => evListeners.forEach(evListener => evListener.remove()));
}

export interface MVCEvent<T> {
  newArr: T[];
  evName: MvcEventType;
  index: number;
  previous?: T;
}

export type MvcEventType = 'insert_at' | 'remove_at' | 'set_at';
