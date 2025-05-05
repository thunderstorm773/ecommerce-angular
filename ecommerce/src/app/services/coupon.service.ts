import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coupon } from '../common/coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private couponURL: string = environment.ecommerceURL + 'coupons';

  constructor(private httpClient: HttpClient) { }

  getActiveCouponsPaginate(currentPageNumber: number, 
                           pageSize: number): Observable<GetResponseCoupon> {

    let activeCouponURL = `${this.couponURL}/actives?page=${currentPageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseCoupon>(activeCouponURL);
  }

  chechIsActiveCoupon(couponCode: string): Observable<Coupon> {
    const checkActiveCouponURL = `${this.couponURL}/check-active/${couponCode}`;
    return this.httpClient.get<Coupon>(checkActiveCouponURL);
  }
}

interface GetResponseCoupon {
  content: Coupon[];
}
