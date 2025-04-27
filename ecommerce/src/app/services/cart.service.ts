import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { Coupon } from '../common/coupon';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  cartItemsKey: string = 'cartItems';
  couponsKey: string = 'coupons';
  coupons: Coupon[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor() { 
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

    // publish the new values
    this.totalPrice.next(totalPriceValue);
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
}
