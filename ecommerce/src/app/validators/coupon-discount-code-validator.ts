import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { CouponService } from "../services/coupon.service";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CouponDiscountCodeValidator implements AsyncValidator {

    constructor(private couponService: CouponService) { }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return of(null);
    }
    
    validateCustom(couponId: number | null, control: AbstractControl): Observable<ValidationErrors | null> {
        if (!control.value || control.value.trim().length === 0) {
            return of(null);
        }
    
        return this.couponService.canEditCouponDiscountCode(couponId, control.value).pipe(
            map(data => (!data ? { couponDiscountCodeExists: true } : null)),
            catchError(() => of(null))
         );
    }
}
