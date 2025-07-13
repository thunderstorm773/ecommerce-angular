import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormValidator } from '../../validators/form-validator';
import { UserRegistrationService } from '../../services/user-registration.service';
import { RegisterUser } from '../../common/register-user';

@Component({
  selector: 'app-register',
  standalone: false,
  
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerUserFormGroup!: FormGroup;
  isDisabled: boolean = false;
  
  constructor(private userRegistrationService: UserRegistrationService,
              private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService) { }

   ngOnInit(): void {
    this.createRegisterFormGroup();
  }
  
  createRegisterFormGroup() {
    this.registerUserFormGroup = this.formBuilder.group({
        email: ['', {validators: [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")] }],
        firstName: ['', {validators: [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace] }],
        lastName: ['', {validators: [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace] }],
        password: ['', {validators: [Validators.required, Validators.minLength(5), FormValidator.checkNotOnlyWhitespace] }]                                    
    });
  }

  registerUser() {
    if (this.registerUserFormGroup.invalid) {
        this.registerUserFormGroup.markAllAsTouched();
        return;
    }

    this.isDisabled = true;
    const registerUser = new RegisterUser(this.firstName?.value, this.lastName?.value, 
                                          this.email?.value, this.password?.value);

    this.userRegistrationService.registerUser(registerUser).subscribe({
        next: () => {
          this.isDisabled = false;
          this.router.navigateByUrl('/login');
          this.toastService.show({message: 'User registration successful', className: 'bg-success-toast text-light' });
        },
        error: (err) => {
          this.isDisabled = false;
          this.toastService.show({message: `User registration error: ${err.message}`, className: 'bg-danger text-light' });
        }
      });
  }

  get email() {
    return this.registerUserFormGroup.get('email');
  }

  get firstName() {
    return this.registerUserFormGroup.get('firstName');
  }

  get lastName() {
    return this.registerUserFormGroup.get('lastName');
  }

  get password() {
    return this.registerUserFormGroup.get('password');
  }
}
