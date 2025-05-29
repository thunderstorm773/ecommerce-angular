import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { ProductCategoryService } from "../services/product-category.service";
import { catchError, map, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class CategoryNameValidator implements AsyncValidator {

    constructor(private productCategoryService: ProductCategoryService) { }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return of(null);
    }

    validateCustom(categoryId: number | null, control: AbstractControl): Observable<ValidationErrors | null> {
        if (!control.value || control.value.trim().length === 0) {
            return of(null);
        }

        return this.productCategoryService.canEditProductCategoryName(categoryId, control.value).pipe(
            map(data => (!data ? { categoryNameExists: true } : null)),
            catchError(() => of(null))
        );
    }
}
