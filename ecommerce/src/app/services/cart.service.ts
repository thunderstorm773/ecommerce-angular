import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { Coupon } from '../common/coupon';
import { SystemParameterService } from './system-parameter.service';
import { SystemParameter } from '../common/system-parameter';
import { CurrencyService } from './currency.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  bgnEurExchangeRate: string = 'BGN_EUR_EXCHANGE_RATE';

  cartItems: CartItem[] = [];
  cartItemsKey: string = 'cartItems';
  couponsKey: string = 'coupons';
  coupons: Coupon[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalPriceEur: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  bgnEurExchangeRateParam: SystemParameter | null = null;

  storage: Storage = sessionStorage;

  constructor(private currencyService: CurrencyService,
              private systemParameterService: SystemParameterService) { 
    
    this.initializeBgnEurExchangeRate();
    this.getCouponsFromStorage();
    this.getCartItemsFromStorage();
  }

  getCartItemsFromStorage() {
    let data = JSON.parse(this.storage.getItem(this.cartItemsKey)!);

    // If there is data in the session storage
    if (data != null) {

      this.cartItems = data;
      this.computeCartTotals();
    }
  }

  getCouponsFromStorage() {
    let data = JSON.parse(this.storage.getItem(this.couponsKey)!);

    // If there is data in the session storage
    if (data != null) {
      this.coupons = data;
    }
  }

  persistCartItems() {
    this.storage.setItem(this.cartItemsKey, JSON.stringify(this.cartItems));
  }

  persistCoupons() {
    this.storage.setItem(this.couponsKey, JSON.stringify(this.coupons));
  }

  addToCart(cartItem: CartItem) {
    let existingCartItem: CartItem | undefined = undefined;

    // if there are cart items 
    if (this.cartItems.length > 0) {
      // find cart item based on id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);
    }
    
    if (existingCartItem != undefined) {
      existingCartItem.quantity++;

      if (existingCartItem.quantity > cartItem.unitsInStock) {
        existingCartItem.quantity = cartItem.unitsInStock;
        alert(`Only ${cartItem.unitsInStock} items for "${cartItem.name}" are available in stock.`);
      }
    } else {
      this.cartItems.push(cartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let cartItem of this.cartItems) {
      totalPriceValue += cartItem.quantity * cartItem.unitPrice;
      totalQuantityValue += cartItem.quantity;
    }

    // if there is applied coupon
    if (this.coupons.length > 0) {
      for (const coupon of this.coupons) {
        totalPriceValue = totalPriceValue - (totalPriceValue * coupon.discountPercent / 100);
      }
    } 
    
    // remove coupons from storage if the cart is empty
    if (this.cartItems.length == 0) {
      this.coupons = [];
    }

    // calculate total price in EUR
    let totalPriceEurValue =  totalPriceValue / Number(this.bgnEurExchangeRateParam?.value);
    console.log(totalPriceEurValue);

    // publish the new values
    this.totalPrice.next(totalPriceValue);
    this.totalPriceEur.next(totalPriceEurValue);
    this.totalQuantity.next(totalQuantityValue);

    // persist cart items
    this.persistCartItems();
    this.persistCoupons();
  }

  decrementItemQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity == 0) {
      this.removeItem(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  removeItem(cartItem: CartItem) {
    // find cart item index in the array
    const cartItemIndex = this.cartItems.findIndex(item => item.id === cartItem.id);

    if (cartItemIndex > -1) {
      this.cartItems.splice(cartItemIndex, 1);
      this.computeCartTotals();
    }
  }

  initializeBgnEurExchangeRate() {
    this.systemParameterService.getSystemParameterByCode(this.bgnEurExchangeRate).subscribe(
      data => this.bgnEurExchangeRateParam = data
    );
  }

}
