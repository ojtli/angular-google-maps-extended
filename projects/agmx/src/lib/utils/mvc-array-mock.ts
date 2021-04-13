export class MvcArrayMock<T> extends google.maps.MVCArray<T> {
  private vals: T[] = [];
  private listeners: {
    'remove_at': Function[];
    'insert_at': Function[];
    'set_at': Function[];
    [key: string]: Function[];
  } = {
    'remove_at': [] as Function[],
    'insert_at': [] as Function[],
    'set_at': [] as Function[],
  };
  clear(): void {
    for (let i = this.vals.length - 1; i >= 0; i--) {
      this.removeAt(i);
    }
  }
  getArray(): T[] {
    return [...this.vals];
  }
  getAt(i: number): T {
    return this.vals[i];
  }
  getLength(): number {
    return this.vals.length;
  }
  insertAt(i: number, elem: T): void {
    this.vals.splice(i, 0, elem);
    this.listeners.insert_at.map(listener => listener(i));
  }
  pop(): T {
    const deleted = this.vals.pop();
    this.listeners.remove_at.map(listener => listener(this.vals.length, deleted));
    return deleted;
  }
  push(elem: T): number {
    this.vals.push(elem);
    this.listeners.insert_at.map(listener => listener(this.vals.length - 1));
    return this.vals.length;
  }
  removeAt(i: number): T {
    const deleted = this.vals.splice(i, 1)[0];
    this.listeners.remove_at.map(listener => listener(i, deleted));
    return deleted;
  }
  setAt(i: number, elem: T): void {
    const deleted = this.vals[i];
    this.vals[i] = elem;
    this.listeners.set_at.map(listener => listener(i, deleted));
  }
  forEach(callback: (elem: T, i: number) => void): void {
    this.vals.forEach(callback);
  }
  addListener(eventName: string, handler: Function): google.maps.MapsEventListener {
    const listenerArr = this.listeners[eventName];
    listenerArr.push(handler);
    return {
      remove: () => {
        listenerArr.splice(listenerArr.indexOf(handler), 1);
      },
    };
  }
}
