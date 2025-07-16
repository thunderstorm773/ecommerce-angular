import { Component, OnInit } from '@angular/core';
import { OrderHistoryWithItems } from '../../common/order-history-with-items';
import { ActivatedRoute } from '@angular/router';
import { OrderHistoryService } from '../../services/order-history.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-order-history-details',
  standalone: false,
  
  templateUrl: './order-history-details.component.html',
  styleUrl: './order-history-details.component.css'
})
export class OrderHistoryDetailsComponent implements OnInit {

  orderHistoryDetails!: OrderHistoryWithItems;

  constructor(public currencyService: CurrencyService,
              private orderHistoryService: OrderHistoryService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
        this.handleOrderHistoryDetails();
    });
  }

  handleOrderHistoryDetails() {
    const orderHistoryId: number = +this.route.snapshot.paramMap.get('id')!;

    this.orderHistoryService.getOrderHistory(orderHistoryId).subscribe(
      data => {
        this.orderHistoryDetails = data
      }
    );
  }
}
