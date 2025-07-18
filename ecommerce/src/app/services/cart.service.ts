import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { Coupon } from '../common/coupon';
import { CurrencyService } from './currency.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  cartItemsKey: string = 'cartItems';
  couponsKey: string = 'coupons';
  coupons: Coupon[] = [];

  totalPriceBgn: Subject<number> = new BehaviorSubject<number>(0);
  totalPriceEur: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor(private currencyService: CurrencyService) { 
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

      this.setSubtotalPrices(existingCartItem);
    } else {
      this.setSubtotalPrices(cartItem);
      this.cartItems.push(cartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceBgnValue: number = 0;
    let totalPriceEurValue: number = 0;
    let totalQuantityValue: number = 0;

    let showBgnCurrencyFirst = this.currencyService.showBgnCurrencyFirstParam?.value;
    for (let cartItem of this.cartItems) {
      if (showBgnCurrencyFirst == '1') {
        totalPriceBgnValue += cartItem.quantity * cartItem.unitPrice;
      }else {
        totalPriceEurValue += cartItem.quantity * cartItem.unitPriceEur;
      }
      
      totalQuantityValue += cartItem.quantity;
    }

    // if there is applied coupon
    if (this.coupons.length > 0) {
      for (const coupon of this.coupons) {
        if (showBgnCurrencyFirst == '1') {
          totalPriceBgnValue = totalPriceBgnValue - (totalPriceBgnValue * coupon.discountPercent / 100);
        }else {
          totalPriceEurValue = totalPriceEurValue - (totalPriceEurValue * coupon.discountPercent / 100);
        }
      }
    } 
    
    // calculate total price in BGN or EUR
    if (showBgnCurrencyFirst) {
      if (showBgnCurrencyFirst == '1') {
        totalPriceEurValue = totalPriceBgnValue / Number(this.currencyService.bgnEurExchangeRateParam?.value);
      } else {
        totalPriceBgnValue = totalPriceEurValue * Number(this.currencyService.bgnEurExchangeRateParam?.value);
      }
    }

    // remove coupons from storage if the cart is empty
    if (this.cartItems.length == 0) {
      this.coupons = [];
    }

    // publish the new values
    this.totalPriceBgn.next(totalPriceBgnValue);
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
      this.setSubtotalPrices(cartItem);
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

  setSubtotalPrices(cartItem: CartItem) {
    if (this.currencyService.showBgnCurrencyFirstParam?.value == '1') {
      cartItem.subtotalPrice = cartItem.quantity * cartItem.unitPrice;
      cartItem.subtotalPriceEur = cartItem.subtotalPrice / Number(this.currencyService.bgnEurExchangeRateParam?.value);
    }else {
      cartItem.subtotalPriceEur = cartItem.quantity * cartItem.unitPriceEur;
      cartItem.subtotalPrice = cartItem.subtotalPriceEur * Number(this.currencyService.bgnEurExchangeRateParam?.value);
    }
  }
}
