import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SystemParameterService } from '../../services/system-parameter.service';
import { ToastService } from '../../services/toast.service';
import { FormValidator } from '../../validators/form-validator';
import { AddSystemParameter } from '../../common/add-system-parameter';
import { SystemParameterCodeValidator } from '../../validators/system-parameter-code-validator';

@Component({
  selector: 'app-admin-add-system-parameter',
  standalone: false,
  
  templateUrl: './admin-add-system-parameter.component.html',
  styleUrl: './admin-add-system-parameter.component.css'
})
export class AdminAddSystemParameterComponent implements OnInit {

  systemParameterFormGroup!: FormGroup;
  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private systemParameterService: SystemParameterService,
              private systemParameterCodeValidator: SystemParameterCodeValidator,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.createSystemParameterFormGroup();
  }
  
  createSystemParameterFormGroup() {
    this.systemParameterFormGroup = this.formBuilder.group({
          code: ['', {validators: [Validators.required, Validators.minLength(3), FormValidator.checkNotOnlyWhitespace], 
                      asyncValidators: [(control: AbstractControl) => this.systemParameterCodeValidator.validateCustom(control)]
            }],
          value: ['', {validators: [Validators.required, FormValidator.checkNotOnlyWhitespace]}],
          description: ['', {validators: [Validators.required, FormValidator.checkNotOnlyWhitespace]}]
    });
  }

  createNewSystemParameter() {
    if (this.systemParameterFormGroup.invalid) {
      this.systemParameterFormGroup.markAllAsTouched();
      return;
    }

    this.isDisabled = true;
    const newSystemParameter = new AddSystemParameter(this.code?.value, this.value?.value, this.description?.value);

    this.systemParameterService.createSystemParameter(newSystemParameter).subscribe({
      next: (data) => {
        this.isDisabled = false;
        this.systemParameterFormGroup.reset();

        this.router.navigateByUrl('/admin/system-parameters');
        this.toastService.show({message: 'System parameter created successfully', className: 'bg-success-toast text-light' });
      },
      error: (err) => {
        this.isDisabled = false;
        this.toastService.show({message: `Error creating system parameter: ${err.error.message}`, className: 'bg-danger text-light' });
      }
    });
  }

  get code() {
    return this.systemParameterFormGroup.get('code');
  }

  get value() {
    return this.systemParameterFormGroup.get('value');
  }

  get description() {
    return this.systemParameterFormGroup.get('description');
  }
}
