import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-cart-status',
  standalone: false,
  
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit{
  
  totalPriceBgn: number = 0.00;
  totalPriceEur: number = 0.00;
  totalQuantity: number = 0;

  constructor(public currencyService: CurrencyService,
              private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    // subscribe to the cart totalPrice
    this.cartService.totalPriceBgn.subscribe(
      data => this.totalPriceBgn = data
    );

    this.cartService.totalPriceEur.subscribe(
      data => this.totalPriceEur = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }
}
