import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormValidator } from '../../validators/form-validator';
import { CouponService } from '../../services/coupon.service';
import { CouponDiscountCodeValidator } from '../../validators/coupon-discount-code-validator';
import { AddCoupon } from '../../common/add-coupon';

@Component({
  selector: 'app-admin-add-coupon',
  standalone: false,
  
  templateUrl: './admin-add-coupon.component.html',
  styleUrl: './admin-add-coupon.component.css'
})
export class AdminAddCouponComponent implements OnInit {

  couponFormGroup!: FormGroup;
  isDisabled: boolean = false;
  
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private couponService: CouponService, 
              private couponDiscountCodeValidator: CouponDiscountCodeValidator,
              private toastService: ToastService) {}


  ngOnInit(): void {
    this.createCouponFormGroup();
  }

  createCouponFormGroup() {
    this.couponFormGroup = this.formBuilder.group({
        discountCode: ['', {validators: [Validators.required, Validators.minLength(4), FormValidator.checkNotOnlyWhitespace],
                            asyncValidators: [(control: AbstractControl) => this.couponDiscountCodeValidator.validateCustom(null, control)]
                           }],
        discountPercent: [null, {validators: [Validators.required, Validators.min(1), Validators.max(30)]}],
        validFrom: [null, {validators: [Validators.required]}],
        validTo: [null, {validators: [Validators.required]}],
        status: [false]
    });
  }

  createNewCoupon() {
    if (this.couponFormGroup.invalid) {
      this.couponFormGroup.markAllAsTouched();
      return;
    }

    this.isDisabled = true;
    const discountCode = this.couponFormGroup.controls['discountCode'].value;
    const discountPercent = this.couponFormGroup.controls['discountPercent'].value;
    const validFrom = this.formatDatetime(this.couponFormGroup.controls['validFrom'].value);
    const validTo = this.formatDatetime(this.couponFormGroup.controls['validTo'].value);
    const status = this.couponFormGroup.controls['status'].value;
    const newCoupon = new AddCoupon(discountCode, discountPercent, validFrom, validTo, status);
    
    this.couponService.createCoupon(newCoupon).subscribe({
      next: (data) => {
        this.isDisabled = false;
        this.couponFormGroup.reset();
    
        this.router.navigateByUrl('/admin/coupons');
        this.toastService.show({message: 'Coupon created successfully', className: 'bg-success-toast text-light' });
      },
      error: (err) => {
        this.isDisabled = false;
        this.toastService.show({message: `Error creating coupon: ${err.error.message}`, className: 'bg-danger text-light' });
      }
    });
  }

  formatDatetime(datetime: string): string {
    return new Date(datetime).toISOString();
  }

  get discountCode() {
    return this.couponFormGroup.get('discountCode');
  }

  get discountPercent() {
    return this.couponFormGroup.get('discountPercent');
  }

  get validFrom() {
    return this.couponFormGroup.get('validFrom');
  }

  get validTo() {
    return this.couponFormGroup.get('validTo');
  }

  get status() {
    return this.couponFormGroup.get('status');
  }
}
