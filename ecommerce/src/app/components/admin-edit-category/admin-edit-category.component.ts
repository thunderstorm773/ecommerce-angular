import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from '../../validators/form-validator';
import { ProductCategoryService } from '../../services/product-category.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-edit-category',
  standalone: false,
  
  templateUrl: './admin-edit-category.component.html',
  styleUrl: './admin-edit-category.component.css'
})
export class AdminEditCategoryComponent implements OnInit {

  categoryFormGroup!: FormGroup;
  
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private productCategoryService: ProductCategoryService) { }

  ngOnInit(): void {
      this.editCategoryFormGroup();
      this.fillCategoryName()
    }
  
    editCategoryFormGroup() {
      this.categoryFormGroup = this.formBuilder.group({
        categoryName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace])
      });
    }

    fillCategoryName() {
      const categoryId: number = +this.route.snapshot.paramMap.get('id')!;

      this.productCategoryService.getProductCategoryById(categoryId).subscribe(
        data => {
          this.categoryName?.setValue(data.categoryName);
        }
      );
    }
  
    editCategory() {
      if (this.categoryFormGroup.invalid) {
        this.categoryFormGroup.markAllAsTouched();
        return;
      }

      console.log('editCategory()');
    }
  
    get categoryName() {
      return this.categoryFormGroup.get('categoryName');
    }
}
