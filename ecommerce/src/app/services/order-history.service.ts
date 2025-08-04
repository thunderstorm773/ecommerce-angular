import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment';
import { OrderHistoryWithItems } from '../common/order-history-with-items';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderURL: string =  environment.ecommerceURL + 'orders';
  private orderAdminURL: string =  environment.ecommerceURL + 'admin/orders';

  constructor(private httpClient: HttpClient) { }

  getOrderHistoryPaginate(email: string, currentPageNumber: number, 
                          pageSize: number): Observable<GetResponseOrderHistory> {

    const orderHistoryURL = `${this.orderURL}?customerEmail=${email}&page=${currentPageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryURL);
  }

  getAllOrdersPaginate(currentPageNumber: number, pageSize: number): Observable<GetResponseOrderHistory> {

    const ordersURL = `${this.orderAdminURL}?page=${currentPageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseOrderHistory>(ordersURL);
  }

  getOrderHistory(orderHistoryId: number): Observable<OrderHistoryWithItems> {
    const orderHistoryURL = `${this.orderURL}/${orderHistoryId}`;
    return this.httpClient.get<OrderHistoryWithItems>(orderHistoryURL);
  }

  getOrder(orderId: number): Observable<OrderHistoryWithItems> {
    const orderURL = `${this.orderAdminURL}/${orderId}`;
    return this.httpClient.get<OrderHistoryWithItems>(orderURL);
  }

  processOrder(orderId: number): Observable<any> {
    const orderURL = `${this.orderAdminURL}/process/${orderId}`;
    return this.httpClient.post(orderURL, null);
  }

  rejectOrder(orderId: number): Observable<any> {
    const orderURL = `${this.orderAdminURL}/reject/${orderId}`;
    return this.httpClient.post(orderURL, null);
  }
}

interface GetResponseOrderHistory {
  content: OrderHistory[];
}
