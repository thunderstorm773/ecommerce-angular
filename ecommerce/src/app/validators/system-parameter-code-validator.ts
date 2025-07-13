import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { catchError, map, Observable, of } from "rxjs";
import { SystemParameterService } from "../services/system-parameter.service";

@Injectable({
    providedIn: 'root'
})
export class SystemParameterCodeValidator implements AsyncValidator {

    constructor(private systemParameterService: SystemParameterService) { }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return of(null);
    }

    validateCustom(control: AbstractControl): Observable<ValidationErrors | null> {
        if (!control.value || control.value.trim().length === 0) {
            return of(null);
        }
    
        return this.systemParameterService.getSystemParameterByCode(control.value).pipe(
            map(data => (data ? { parameterNameExists: true } : null)),
            catchError(() => of(null))
        );
    }
}
