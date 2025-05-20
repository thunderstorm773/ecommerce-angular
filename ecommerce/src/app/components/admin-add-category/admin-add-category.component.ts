import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryNameValidator } from '../../validators/category-name-validator';
import { FormValidator } from '../../validators/form-validator';

@Component({
  selector: 'app-admin-add-category',
  standalone: false,
  
  templateUrl: './admin-add-category.component.html',
  styleUrl: './admin-add-category.component.css'
})
export class AdminAddCategoryComponent implements OnInit {

  categoryFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private categoryNameValidator: CategoryNameValidator) { }

  ngOnInit(): void {
    this.createCategoryFormGroup();
  }

  createCategoryFormGroup() {
    this.categoryFormGroup = this.formBuilder.group({
      categoryName: ['', {validators: [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace], 
                          asyncValidators: [this.categoryNameValidator.validate.bind(this.categoryNameValidator)]
        }]
    });
  }

  createNewCategory() {
    if (this.categoryFormGroup.invalid) {
      this.categoryFormGroup.markAllAsTouched();
      return;
    }

    console.log('createNewCategory()');
  }

  get categoryName() {
    return this.categoryFormGroup.get('categoryName');
  }
}
