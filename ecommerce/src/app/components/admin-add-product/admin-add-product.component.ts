import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { FormValidator } from '../../validators/form-validator';
import { AddProduct } from '../../common/add-product';
import { ProductCategory } from '../../common/product-category';
import { ProductCategoryService } from '../../services/product-category.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-admin-add-product',
  standalone: false,
  
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.css'
})
export class AdminAddProductComponent implements OnInit {

  productFormGroup!: FormGroup;
  isDisabled: boolean = false;

  productCategories: ProductCategory[] = [];
  imageFile!: File;
  mainCurrency: string = '';
    
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private productService: ProductService, 
              private productCategoryService: ProductCategoryService,
              private currencyService: CurrencyService,
              private toastService: ToastService) {}
  
  
  ngOnInit(): void {
    this.mainCurrency = this.currencyService.getMainCurrencyCode();
    this.fillProductCategories();
    this.createProductFormGroup();
  }

  createProductFormGroup() {
    this.productFormGroup = this.formBuilder.group({
        name: ['', {validators: [Validators.required, Validators.minLength(4), FormValidator.checkNotOnlyWhitespace]}],
        description: ['', {validators: [Validators.required, Validators.minLength(10), FormValidator.checkNotOnlyWhitespace]}],
        categoryId: ['', {validators: [Validators.required]}],
        unitPrice: [null, {validators: [Validators.required, Validators.min(0.5)]}],
        image: [null, {validators: [FormValidator.checkFile]}],
        unitsInStock: [null, {validators: [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]}],
        isActive: [false] 
      });
  }

  fillProductCategories() {
    this.productCategoryService.getActiveProductCategories().subscribe(
      data => { this.productCategories = data; },
    );
  }

  createNewProduct() {
    if (this.productFormGroup.invalid) {
        this.productFormGroup.markAllAsTouched();
        return;
    }
    
    this.isDisabled = true;
    const name = this.productFormGroup.controls['name'].value;
    const description = this.productFormGroup.controls['description'].value;
    const categoryId = this.productFormGroup.controls['categoryId'].value;
    const unitPrice = this.productFormGroup.controls['unitPrice'].value;
    const unitsInStock = this.productFormGroup.controls['unitsInStock'].value;
    const isActive = this.productFormGroup.controls['isActive'].value;
    const newProduct = new AddProduct(name, description, unitPrice, this.imageFile, unitsInStock, categoryId, isActive);
        
    this.productService.createProduct(newProduct).subscribe({
        next: (data) => {
          this.isDisabled = false;
          this.productFormGroup.reset();
        
          this.router.navigateByUrl('/');
          this.toastService.show({message: 'Product created successfully', className: 'bg-success-toast text-light' });
        },
        error: (err) => {
          this.isDisabled = false;
          this.toastService.show({message: `Error creating product: ${err.error.message}`, className: 'bg-danger text-light' });
        }
      });
  }

  onFileChange(event: Event) {
    const imageInput = event.target as HTMLInputElement;
    if(imageInput.files && imageInput.files.length > 0) {
      this.imageFile = imageInput.files[0];
      console.log(this.imageFile);

      this.image?.patchValue(this.imageFile);
      this.image?.updateValueAndValidity();
    }
  }

  get name() {
    return this.productFormGroup.get('name');
  }

  get description() {
    return this.productFormGroup.get('description');
  }

  get image() {
    return this.productFormGroup.get('image');
  }

  get categoryId() {
    return this.productFormGroup.get('categoryId');
  }

  get unitPrice() {
    return this.productFormGroup.get('unitPrice');
  }

  get unitsInStock() {
    return this.productFormGroup.get('unitsInStock');
  }

  get isActive() {
    return this.productFormGroup.get('isActive');
  }
}
