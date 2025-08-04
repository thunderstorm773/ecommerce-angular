import { Component, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { CurrencyService } from '../../services/currency.service';
import { OrderHistoryService } from '../../services/order-history.service';

@Component({
  selector: 'app-admin-orders',
  standalone: false,
  
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {

  ordersList: OrderHistory[] = [];
  
  // pagination properties
  currentPageNumber: number = 1;
  pageSize: number = 20;
  totalElements: number = 0;
  
  constructor(public currencyService: CurrencyService,
              private orderHistoryService: OrderHistoryService) { }
  
  ngOnInit(): void {
    this.listOrders();
  }
  
  listOrders() {
    this.orderHistoryService.getAllOrdersPaginate(this.currentPageNumber, this.pageSize)
                            .subscribe(data => this.processResult(data));
  }
  
  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.currentPageNumber = 1;
    this.listOrders();
  }
  
  processResult(data: any) {
    this.ordersList = data.content;
    this.currentPageNumber = data.number + 1;
    this.pageSize = data.size;
    this.totalElements = data.totalElements;
  }
}
