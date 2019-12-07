import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    //static someServiceWorkingWithDatabase: any;
    static passwordMatcher(control: AbstractControl): { [key: string]: boolean } { 
        const newPassword = control.get('newPassword');
        const confirmPassword = control.get('confirmPassword');
        if (!newPassword || !confirmPassword) return null;

        if (newPassword.pristine || confirmPassword.pristine) {
            return null;
        }
        if (confirmPassword.value === newPassword.value) {
            return null;
        }
        else { 
            return { invalidPassword: true }
        }
    };

    // static oldDate(control: AbstractControl): {[key: string]: boolean}{
    //     const date = control.get('secDepartureDate');
    //     var today = new Date();
    //     console.log(today);
    //     if(today.getFullYear() {
    //         return { 'oldDate': true };
    //     }
    //     return null;
    // }

    static range(min: number, max: number): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
                return { 'range': true };
            }
            return null;
        };
    }

    static stringLength(min: number, max: number): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (c.value && (c.value.length < min || c.value.length > max)) {
                return { 'stringLength': true };
            }
            return null;
        };
    }

    static emailConfirmation(): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            c.get('email').clearValidators();
            var email = c.get('email').value;
            var confirmEmail = c.get('confirmEmail').value;

            if (email && confirmEmail && (email != confirmEmail)) {
                c.get('confirmEmail').setErrors({ 'emailMatch': true });
                return { 'emailMatch': true };
            }
            return null;
        };
    }
    
    static nospaceValidator(): ValidatorFn {
        return (control: AbstractControl): { [s: string]: boolean } | null => {
            if (!/^[\dA-Za-z]+[\dA-Za-z\s]{0,50}$/.test(control.value)) {
                return { nospaceValidator: true };
            }
        }
    }


    static dateLessThan(fromDate: string, toDate: string, validatorField: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const date1 = c.get(fromDate).value;
            const date2 = c.get(toDate).value;
            if ((date1 !== null && date2 !== null) && date1 > date2) {
                return validatorField;
            }
            return null;
        };
    }
    static passwordValidator(password): any {
        if (password.pristine) {
            return null;
        } 
        password.markAsTouched();
        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/.test(password.value)) {
            return null;
        }
        return {
            invalidPassword: true
        };
    }
    static compareDate(): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            c.get('fromDate').clearValidators();
            var fromDate = c.get('fromDate').value;
            var toDate = c.get('toDate').value;

            if ((fromDate && toDate) && fromDate > toDate) {
                c.get('toDate').setErrors({ 'compareDate': true });
                return { 'compareDate': true };
            }
            return null;
        };
    }

    static pincodePattern(): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (!/^[0-9]{6}$/.test(c.value)) {
                return { pincodePattern: true };
            }
        }
    }

    static phoneNumberPattern(): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (!/^[0-9]{10}$/.test(c.value)) {
                return { phoneNumberPattern: true };
            }
        }
    }

    static numberPattern(): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (!/^[1-9]\d*(\.\d+)?$/.test(c.value)) {
                return { phoneNumberPattern: true };
            }
        }
    }
    static passwordPattern(): ValidatorFn{
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if(!/^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/.test(c.value)){
                return { passwordPattern :true};
            }

        }
    }
}
