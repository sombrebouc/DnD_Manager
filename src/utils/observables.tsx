// src/observables.ts
import { Observable } from 'rxjs';

export const someObservable = new Observable(subscriber => {
  subscriber.next('Hello, world!');
  subscriber.complete();
});