import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormValidator } from '../../validators/form-validator';

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
              private toastService: ToastService) {}


  ngOnInit(): void {
    this.createCouponFormGroup();
  }

  createCouponFormGroup() {
    this.couponFormGroup = this.formBuilder.group({
        discountCode: ['', {validators: [Validators.required, Validators.minLength(4), FormValidator.checkNotOnlyWhitespace]}],
        discountPercent: [null, {validators: [Validators.required, Validators.min(1), Validators.max(30)]}],
        validFrom: [null, {validators: [Validators.required]}],
        validTo: [null, {validators: [Validators.required]}],
        isActive: [false]
    });
  }

  createNewCoupon() {
    if (this.couponFormGroup.invalid) {
      this.couponFormGroup.markAllAsTouched();
      return;
    }


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
