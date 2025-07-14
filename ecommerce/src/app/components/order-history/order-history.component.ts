import { Component, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-order-history',
  standalone: false,
  
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  // pagination properties
  currentPageNumber: number = 1;
  pageSize: number = 20;
  totalElements: number = 0;

  constructor(public currencyService: CurrencyService,
              private orderHistoryService: OrderHistoryService) { }

  async ngOnInit(): Promise<void> {
    await this.currencyService.initSystemParams();
    
    this.listOrderHistory();
  }

  listOrderHistory() {
    const userEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.orderHistoryService.getOrderHistoryPaginate(userEmail, this.currentPageNumber, this.pageSize)
                            .subscribe(data => this.processResult(data));
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.currentPageNumber = 1;
    this.listOrderHistory();
  }

  processResult(data: any) {
    this.orderHistoryList = data.content;
    this.currentPageNumber = data.number + 1;
    this.pageSize = data.size;
    this.totalElements = data.totalElements;
  }
}
