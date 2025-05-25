import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryNameValidator } from '../../validators/category-name-validator';
import { FormValidator } from '../../validators/form-validator';
import { AddProductCategory } from '../../common/add-product-category';
import { ProductCategoryService } from '../../services/product-category.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-add-category',
  standalone: false,
  
  templateUrl: './admin-add-category.component.html',
  styleUrl: './admin-add-category.component.css'
})
export class AdminAddCategoryComponent implements OnInit {

  categoryFormGroup!: FormGroup;
  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private categoryNameValidator: CategoryNameValidator,
              private productCategoryService: ProductCategoryService,
              private toastService: ToastService) { }

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

    this.isDisabled = true;
    const categoryName = this.categoryFormGroup.controls['categoryName'].value;
    const newProductCategory = new AddProductCategory(categoryName);

    this.productCategoryService.createProductCategory(newProductCategory).subscribe({
      next: (data) => {
        this.isDisabled = false;
        this.categoryFormGroup.reset();

        this.router.navigateByUrl('/admin/categories');
        this.productCategoryService.notifyRefreshActiveProductCategories();
        this.toastService.show({message: 'Category created successfully', className: 'bg-success-toast text-light' });
      },
      error: (err) => {
        this.isDisabled = false;
        this.toastService.show({message: `Error creating category: ${err.error.message}`, className: 'bg-danger text-light' });
      }
    });
  }

  get categoryName() {
    return this.categoryFormGroup.get('categoryName');
  }
}
