import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment';

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
}

interface GetResponseOrderHistory {
  content: OrderHistory[];
}
