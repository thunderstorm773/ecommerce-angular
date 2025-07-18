import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {  }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    const baseURL = environment.ecommerceURL;
    const securedEndpoints = ['orders', 'coupons/actives', 'admin/coupons', 
                              'admin/product-categories', 'checkout', 'comments/add', 
                              'comments/delete', 'admin/system-parameters',
                              'products', 'admin/products'];

    if (securedEndpoints.some(url => request.urlWithParams.includes(baseURL + url))) {
      // get access token
      const accessToken = this.oktaAuth.getAccessToken();
      if(accessToken) {
        // clone the request and add new header with access token
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + accessToken
          }
        });

      }
    }

    return await lastValueFrom(next.handle(request));
  }
}
