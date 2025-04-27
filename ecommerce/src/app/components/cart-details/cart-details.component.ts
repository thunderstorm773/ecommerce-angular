import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from '../../validators/form-validator';
import { CouponService } from '../../services/coupon.service';


@Component({
  selector: 'app-cart-details',
  standalone: false,
  
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit{

  cartItems: CartItem[] = [];
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  couponFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private couponService: CouponService) {}

  ngOnInit(): void {
    this.createCouponFormGroup();
    this.listCartDetails();
  }

  listCartDetails() {
    // get cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // compute cart total price and quantity
    this.cartService.computeCartTotals();
  }

  incrementItemQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  decrementItemQuantity(cartItem: CartItem) {
    this.cartService.decrementItemQuantity(cartItem);
  }

  removeItem(cartItem: CartItem) {
    this.cartService.removeItem(cartItem);
  }

  createCouponFormGroup() {
    this.couponFormGroup = this.formBuilder.group({
      couponCode: new FormControl('', [Validators.required, Validators.minLength(4), FormValidator.checkNotOnlyWhitespace])
    });
  }

  applyCoupon() {
    if (this.couponFormGroup.invalid) {
      this.couponFormGroup.markAllAsTouched();
      return;
    }

    this.checkIsCouponActive();
  }

  checkIsCouponActive() {
    const couponCode = this.couponCode?.value;

    this.couponService.chechIsActiveCoupon(couponCode).subscribe({
      next: data => {
        if (!data) {
          alert('Invalid coupon code!');

        } else {
          if (this.cartService.coupons.length > 0) {
            alert('Already applied coupon code!');
            return;
          }

          this.cartService.coupons.push(data);
          this.cartService.computeCartTotals();
          alert(`Coupon code ${data.discountCode} is applied!`);
        }
      },
      error: err => {
        alert('Invalid coupon code!');
      }
    });
  }

  setCouponCodeUppercase() {
    this.couponCode?.setValue(this.couponCode?.value.toUpperCase());
  }

  get couponCode() {
    return this.couponFormGroup.get('couponCode');
  }
}
