import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormValidator } from '../../validators/form-validator';
import { CouponService } from '../../services/coupon.service';
import { CouponDiscountCodeValidator } from '../../validators/coupon-discount-code-validator';
import { EditCoupon } from '../../common/edit-coupon';

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
    this.editCouponFormGroup();
    this.fillCoupon();
  }
    
  editCouponFormGroup() {
    const couponId: number = this.getCouponId();
    this.couponFormGroup = this.formBuilder.group({
          discountCode: ['', {validators: [Validators.required, Validators.minLength(4), FormValidator.checkNotOnlyWhitespace],
                              asyncValidators: [(control: AbstractControl) => this.couponDiscountCodeValidator.validateCustom(couponId, control)]
                             }],
          discountPercent: [null, {validators: [Validators.required, Validators.min(1), Validators.max(30)]}],
          validFrom: [null, {validators: [Validators.required]}],
          validTo: [null, {validators: [Validators.required]}],
          status: [false]
      });
  }

  editCoupon() {
    if (this.couponFormGroup.invalid) {
        this.couponFormGroup.markAllAsTouched();
        return;
    }
  
    const couponId: number = +this.route.snapshot.paramMap.get('id')!;
    
    this.isDisabled = true;
    const discountCode = this.couponFormGroup.controls['discountCode'].value;
    const discountPercent = this.couponFormGroup.controls['discountPercent'].value;
    const validFrom = this.formatDatetime(this.couponFormGroup.controls['validFrom'].value);
    const validTo = this.formatDatetime(this.couponFormGroup.controls['validTo'].value);
    const status = this.couponFormGroup.controls['status'].value;
    const coupon = new EditCoupon(discountCode, discountPercent, validFrom, validTo, status);
          
    this.couponService.editCoupon(couponId, coupon).subscribe({
      next: (data) => {
        this.isDisabled = false;
        this.couponFormGroup.reset();
          
        this.router.navigateByUrl('/admin/coupons');
        this.toastService.show({message: 'Coupon edited successfully', className: 'bg-success-toast text-light' });
      },
      error: (err) => {
        this.isDisabled = false;
        this.toastService.show({message: `Error editing coupon: ${err.error.message}`, className: 'bg-danger text-light' });
      }
    });
  }

  fillCoupon() {
    const couponId: number = this.getCouponId();

    this.couponService.getCouponById(couponId).subscribe(
      data => {
        this.discountCode?.setValue(data.discountCode);
        this.discountPercent?.setValue(data.discountPercent);
        this.validFrom?.setValue(data.validFrom);
        this.validTo?.setValue(data.validTo);
        this.status?.setValue(data.status);
      }
    );
  }

  getCouponId() {
    return +this.route.snapshot.paramMap.get('id')!;
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
