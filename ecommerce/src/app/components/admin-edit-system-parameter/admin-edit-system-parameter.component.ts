import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemParameterService } from '../../services/system-parameter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormValidator } from '../../validators/form-validator';
import { EditSystemParameter } from '../../common/edit-system-parameter';

@Component({
  selector: 'app-admin-edit-system-parameter',
  standalone: false,
  
  templateUrl: './admin-edit-system-parameter.component.html',
  styleUrl: './admin-edit-system-parameter.component.css'
})
export class AdminEditSystemParameterComponent implements OnInit {

  systemParameterFormGroup!: FormGroup;
  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private systemParameterService: SystemParameterService,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.editSystemParameterFormGroup();
    this.fillSystemParameter()
  }

  editSystemParameterFormGroup() {
    this.systemParameterFormGroup = this.formBuilder.group({
          code: [{value: '', disabled: true}],
          value: ['', {validators: [Validators.required, FormValidator.checkNotOnlyWhitespace]}],
          description: ['', {validators: [Validators.required, FormValidator.checkNotOnlyWhitespace]}]
    });
  }

  fillSystemParameter() {
    const systemParameterId: number = this.getSystemParameterId();

    this.systemParameterService.getSystemParameter(systemParameterId).subscribe(
      data => {
        this.code?.setValue(data.code);
        this.value?.setValue(data.value);
        this.description?.setValue(data.description);
      }
    );
  }

  editSystemParameter() {
    if (this.systemParameterFormGroup.invalid) {
      this.systemParameterFormGroup.markAllAsTouched();
      return;
    }
    
    const systemParameterId: number = this.getSystemParameterId();
    
    this.isDisabled = true;
    const systemParameter = new EditSystemParameter(this.value?.value, this.description?.value);
          
    this.systemParameterService.editSystemParameter(systemParameterId, systemParameter).subscribe({
      next: (data) => {
        this.isDisabled = false;
        this.systemParameterFormGroup.reset();
          
        window.location.href = '/admin/system-parameters';
      },
      error: (err) => {
        this.isDisabled = false;
        this.toastService.show({message: `Error editing system parameter: ${err.error.message}`, className: 'bg-danger text-light' });
      }
    });
  }

  getSystemParameterId() {
    return +this.route.snapshot.paramMap.get('id')!;
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
