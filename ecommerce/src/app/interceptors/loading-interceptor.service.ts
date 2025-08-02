import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingSpinnerService } from '../services/loading-spinner.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptorService implements HttpInterceptor {

  constructor(private loadingSpinnerService: LoadingSpinnerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingSpinnerService.show();

    return next.handle(request).pipe(
      finalize(() => this.loadingSpinnerService.hide())
    );
  }
}
