import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from '../../validators/form-validator';

@Component({
  selector: 'app-admin-edit-category',
  standalone: false,
  
  templateUrl: './admin-edit-category.component.html',
  styleUrl: './admin-edit-category.component.css'
})
export class AdminEditCategoryComponent implements OnInit {

  categoryFormGroup!: FormGroup;
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
      this.editCategoryFormGroup();
    }
  
    editCategoryFormGroup() {
      this.categoryFormGroup = this.formBuilder.group({
        categoryName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace])
      });
    }
  
    editCategory() {
      console.log('editCategory()');
    }
  
    get categoryName() {
      return this.categoryFormGroup.get('categoryName');
    }
}
