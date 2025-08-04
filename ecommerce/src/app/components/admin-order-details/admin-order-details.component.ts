import { Component, OnInit } from '@angular/core';
import { OrderHistoryWithItems } from '../../common/order-history-with-items';
import { CurrencyService } from '../../services/currency.service';
import { OrderHistoryService } from '../../services/order-history.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-order-details',
  standalone: false,
  
  templateUrl: './admin-order-details.component.html',
  styleUrl: './admin-order-details.component.css'
})
export class AdminOrderDetailsComponent implements OnInit {

  orderDetails!: OrderHistoryWithItems;
  
  constructor(public currencyService: CurrencyService,
              private orderHistoryService: OrderHistoryService,
              private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
        this.handleOrderDetails();
    });
  }
  
  handleOrderDetails() {
    const orderId: number = +this.route.snapshot.paramMap.get('id')!;
  
    this.orderHistoryService.getOrder(orderId).subscribe(
      data => {
        this.orderDetails = data
      }
    );
  }
}
