import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";

export class FormValidator {

    // whitespace validation
    static checkNotOnlyWhitespace(control: FormControl): ValidationErrors {
        // check if string only contains whitespace
        if((control.value != null) && (control.value.trim().length === 0)) {

            return { 'notOnlyWhitespace': true };
        } else {
            return {};
        }
    }

    static futureOrPresent(control: FormControl): ValidationErrors {
        const now = new Date();

        const val = control.value;
        if (!val) {
            return {};
        }

        const inputDate = new Date(val);
        
        // seconds/milliseconds are not considered
        now.setSeconds(0, 0);
        inputDate.setSeconds(0, 0);

        return inputDate >= now ? {} : { 'notFutureOrPresent': true };
    }

    static future(control: FormControl): ValidationErrors {
        const now = new Date();

        const val = control.value;
        if (!val) {
            return {};
        }

        const inputDate = new Date(val);
        
        // seconds/milliseconds are not considered
        now.setSeconds(0, 0);
        inputDate.setSeconds(0, 0);

        return inputDate > now ? {} : { 'notFuture': true };
    }

    static validToAfterValidFrom(group: AbstractControl): ValidationErrors {
        const validFrom = group.get('validFrom')?.value;
        const validTo = group.get('validTo')?.value;

        if (!validFrom || !validTo) {
            return {};
        }

        const validFromDate = new Date(validFrom);
        const validToDate = new Date(validTo);

        validFromDate.setSeconds(0, 0);
        validToDate.setSeconds(0, 0);

        return validFromDate <= validToDate ? {} : { 'validToBeforeValidFrom': true };
    }

    static checkFile(control: FormControl): ValidationErrors {
        const file = control.value;

        if (!file) {
            return { required: true };
        }

        const allowedTypes = ['image/png', 'image/jpeg'];
        if (!allowedTypes.includes(file.type)) {
            return { invalidType: true };
        }

        const maxBytesSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxBytesSize) {
            return { maxSize: true };
        }

        return {};
    } 
}
