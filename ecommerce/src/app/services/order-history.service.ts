import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderURL: string =  environment.ecommerceURL + 'orders';

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {

    const orderHistoryURL = `${this.orderURL}?customerEmail=${email}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryURL)
  }
}

interface GetResponseOrderHistory {
  content: OrderHistory[];
}
