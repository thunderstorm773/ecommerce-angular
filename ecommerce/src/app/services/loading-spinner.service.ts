import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loadingSubject.asObservable();

  private requestCount = 0;
  private delayMs = 300;
  private timer: any;

  constructor() { }

  show() {
    this.requestCount++;

    if(this.requestCount === 1) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.requestCount > 0) {
          this.loadingSubject.next(true);
        }
      }, this.delayMs);
    }
  }

  hide() {
    this.requestCount = Math.max(0, this.requestCount - 1);

    if(this.requestCount === 0) {
      clearTimeout(this.timer);
      this.loadingSubject.next(false);
    }
  }
}
