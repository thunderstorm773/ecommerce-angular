import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormValidator } from '../../validators/form-validator';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import { UserRegistrationService } from '../../services/user-registration.service';

@Component({
  selector: 'app-register',
  standalone: false,
  
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerUserFormGroup!: FormGroup;
  
  constructor(private userRegistrationService: UserRegistrationService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
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

  async registerUser() {
    if (this.registerUserFormGroup.invalid) {
        this.registerUserFormGroup.markAllAsTouched();
        return;
    }

    this.userRegistrationService.registerUser(this.registerUserFormGroup.value).subscribe({
        next: () => {
          this.router.navigateByUrl('/login');
          this.toastService.show({message: 'User registration successful', className: 'bg-success-toast text-light' });
        },
        error: (err) => {
          console.error('User registration error:', err);
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
