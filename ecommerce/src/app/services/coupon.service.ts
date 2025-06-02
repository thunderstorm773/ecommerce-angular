import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coupon } from '../common/coupon';
import { AddCoupon } from '../common/add-coupon';
import { EditCoupon } from '../common/edit-coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private couponURL: string = environment.ecommerceURL + 'coupons';
  private couponAdminBaseUrl =  environment.ecommerceURL + 'admin/coupons';

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

  getAllCouponsPaginate(currentPageNumber: number, 
                        pageSize: number): Observable<GetResponseCoupon> {

    const couponUrl = `${this.couponAdminBaseUrl}?page=${currentPageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseCoupon>(couponUrl);
  }

  canEditCouponDiscountCode(id: number | null, discountCode: string): Observable<any> {
    const queryString = id ? `id=${id}&discountCode=${discountCode}` : `discountCode=${discountCode}`;
    const couponUrl = `${this.couponAdminBaseUrl}/can-edit-discount-code?${queryString}`;
    return this.httpClient.get(couponUrl);
  }

  createCoupon(coupon: AddCoupon): Observable<any> {
    const couponUrl = `${this.couponAdminBaseUrl}/add`;
    return this.httpClient.post<AddCoupon>(couponUrl, coupon);
  }

  editCoupon(id: number, coupon: EditCoupon): Observable<any> {
    const couponUrl = `${this.couponAdminBaseUrl}/edit/${id}`;
    return this.httpClient.put<EditCoupon>(couponUrl, coupon);
  }

  deleteCoupon(id: number): Observable<any> {
    const couponUrl = `${this.couponAdminBaseUrl}/delete/${id}`;
    return this.httpClient.delete(couponUrl);
  }

  getCouponById(id: number): Observable<Coupon> {
    const couponUrl = `${this.couponAdminBaseUrl}/${id}`;
    return this.httpClient.get<Coupon>(couponUrl);
  }
}

interface GetResponseCoupon {
  content: Coupon[];
}
