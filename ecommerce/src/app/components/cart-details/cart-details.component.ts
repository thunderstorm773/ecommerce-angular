import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from '../../validators/form-validator';
import { CouponService } from '../../services/coupon.service';
import { ToastService } from '../../services/toast.service';
import { CurrencyService } from '../../services/currency.service';


@Component({
  selector: 'app-cart-details',
  standalone: false,
  
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit{

  cartItems: CartItem[] = [];
  totalPrice: number = 0.00;
  totalPriceEur: number = 0.00;
  totalQuantity: number = 0;
  couponFormGroup!: FormGroup;

  constructor(public currencyService: CurrencyService,
              public cartService: CartService,
              private formBuilder: FormBuilder,
              private couponService: CouponService,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.createCouponFormGroup();
    this.listCartDetails();
  }

  listCartDetails() {
    // get cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart totalPrice
    this.cartService.totalPriceBgn.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalPriceEur
    this.cartService.totalPriceEur.subscribe(
      data => this.totalPriceEur = data
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
          this.toastService.show({message: 'Invalid coupon code', className: 'bg-danger text-light' });

        } else {
          if (this.cartService.coupons.length > 0) {
            this.toastService.show({message: 'Already applied coupon code', className: 'bg-danger text-light' });
            return;
          }

          this.cartService.coupons.push(data);
          this.cartService.computeCartTotals();
          this.toastService.show({message: `Coupon code: ${data.discountCode} for ${data.discountPercent}% discount is applied!`, 
                                  className: 'bg-success-toast text-light' });
        }
      },
      error: err => {
        this.toastService.show({message: 'Invalid coupon code', className: 'bg-danger text-light' });
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
