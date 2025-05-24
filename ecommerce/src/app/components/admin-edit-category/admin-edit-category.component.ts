import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from '../../validators/form-validator';
import { ProductCategoryService } from '../../services/product-category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryNameValidator } from '../../validators/category-name-validator';
import { EditProductCategory } from '../../common/edit-product-category';

@Component({
  selector: 'app-admin-edit-category',
  standalone: false,
  
  templateUrl: './admin-edit-category.component.html',
  styleUrl: './admin-edit-category.component.css'
})
export class AdminEditCategoryComponent implements OnInit {

  categoryFormGroup!: FormGroup;
  isDisabled: boolean = false;
  
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private productCategoryService: ProductCategoryService,
              private categoryNameValidator: CategoryNameValidator) { }

  ngOnInit(): void {
      this.editCategoryFormGroup();
      this.fillCategoryName()
    }
  
    editCategoryFormGroup() {
      this.categoryFormGroup = this.formBuilder.group({
        categoryName: ['', {validators: [Validators.required, Validators.minLength(2), FormValidator.checkNotOnlyWhitespace], 
                            asyncValidators: [this.categoryNameValidator.validate.bind(this.categoryNameValidator)]
          }]
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

      const categoryId: number = +this.route.snapshot.paramMap.get('id')!;

      this.isDisabled = true;
      const categoryName = this.categoryFormGroup.controls['categoryName'].value;
      const productCategory = new EditProductCategory(categoryName);
      
          this.productCategoryService.editProductCategory(categoryId, productCategory).subscribe({
            next: (data) => {
              this.isDisabled = false;
              this.categoryFormGroup.reset();
              alert(`Category edited successfully`);
      
              this.router.navigateByUrl('/admin/categories');
              this.productCategoryService.notifyRefreshActiveProductCategories();
            },
            error: (err) => {
              this.isDisabled = false;
              alert(`Error editing category: ${err.error.message}`);
            }
          });
    }
  
    get categoryName() {
      return this.categoryFormGroup.get('categoryName');
    }
}
