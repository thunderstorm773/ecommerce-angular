import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormValidator } from '../../validators/form-validator';
import { CouponService } from '../../services/coupon.service';
import { CouponDiscountCodeValidator } from '../../validators/coupon-discount-code-validator';

@Component({
  selector: 'app-admin-edit-coupon',
  standalone: false,
  
  templateUrl: './admin-edit-coupon.component.html',
  styleUrl: './admin-edit-coupon.component.css'
})
export class AdminEditCouponComponent implements OnInit {

  couponFormGroup!: FormGroup;
  isDisabled: boolean = false;
    
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private couponService: CouponService, 
              private couponDiscountCodeValidator: CouponDiscountCodeValidator,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.createCouponFormGroup();
    this.fillDiscountCode();
  }
    
  createCouponFormGroup() {
    const couponId: number = this.getCouponId();
    this.couponFormGroup = this.formBuilder.group({
          discountCode: ['', {validators: [Validators.required, Validators.minLength(4), FormValidator.checkNotOnlyWhitespace],
                              asyncValidators: [(control: AbstractControl) => this.couponDiscountCodeValidator.validateCustom(couponId, control)]
                             }],
          discountPercent: [null, {validators: [Validators.required, Validators.min(1), Validators.max(30)]}],
          validFrom: [null, {validators: [Validators.required]}],
          validTo: [null, {validators: [Validators.required]}],
          isActive: [false]
      });
  }

  editCoupon() {
    if (this.couponFormGroup.invalid) {
        this.couponFormGroup.markAllAsTouched();
        return;
    }
  
    
  }

  fillDiscountCode() {
    const couponId: number = this.getCouponId();

    
  }

  getCouponId() {
    return +this.route.snapshot.paramMap.get('id')!;
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
  
  get isActive() {
    return this.couponFormGroup.get('isActive');
  }
}
