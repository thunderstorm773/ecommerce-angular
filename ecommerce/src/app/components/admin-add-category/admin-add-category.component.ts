import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from '../../validators/form-validator';

@Component({
  selector: 'app-admin-add-category',
  standalone: false,
  
  templateUrl: './admin-add-category.component.html',
  styleUrl: './admin-add-category.component.css'
})
export class AdminAddCategoryComponent implements OnInit {

  categoryFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createCategoryFormGroup();
  }

  createCategoryFormGroup() {
    this.categoryFormGroup = this.formBuilder.group({
      categoryName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace])
    });
  }

  createNewCategory() {
    console.log('createNewCategory()');
  }

  get categoryName() {
    return this.categoryFormGroup.get('categoryName');
  }
}
