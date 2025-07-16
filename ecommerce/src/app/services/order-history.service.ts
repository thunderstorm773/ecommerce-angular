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

  constructor(private httpClient: HttpClient) { }

  getOrderHistoryPaginate(email: string, currentPageNumber: number, 
                          pageSize: number): Observable<GetResponseOrderHistory> {

    const orderHistoryURL = `${this.orderURL}?customerEmail=${email}&page=${currentPageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryURL)
  }

  getOrderHistory(orderHistoryId: number): Observable<OrderHistoryWithItems> {
    const orderHistoryURL = `${this.orderURL}/${orderHistoryId}`;
    return this.httpClient.get<OrderHistoryWithItems>(orderHistoryURL);
  }
}

interface GetResponseOrderHistory {
  content: OrderHistory[];
}
