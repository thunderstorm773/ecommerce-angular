import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductCategory } from '../../common/product-category';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCategoryService } from '../../services/product-category.service';
import { CurrencyService } from '../../services/currency.service';
import { ToastService } from '../../services/toast.service';
import { FormValidator } from '../../validators/form-validator';
import { EditProduct } from '../../common/edit-product';

@Component({
  selector: 'app-admin-edit-product',
  standalone: false,
  
  templateUrl: './admin-edit-product.component.html',
  styleUrl: './admin-edit-product.component.css'
})
export class AdminEditProductComponent implements OnInit {

  productFormGroup!: FormGroup;
  isDisabled: boolean = false;
  
  productCategories: ProductCategory[] = [];
  mainCurrency: string = '';

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService, 
              private productCategoryService: ProductCategoryService,
              private currencyService: CurrencyService,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.fillProductCategories();
    this.mainCurrency = this.currencyService.getMainCurrencyCode();
    this.editProductFormGroup();
    this.fillProduct();
  }
  
  editProductFormGroup() {
    this.productFormGroup = this.formBuilder.group({
        name: ['', {validators: [Validators.required, Validators.minLength(4), FormValidator.checkNotOnlyWhitespace]}],
        description: ['', {validators: [Validators.required, Validators.minLength(10), FormValidator.checkNotOnlyWhitespace]}],
        categoryId: ['', {validators: [Validators.required]}],
        unitPrice: [null, {validators: [Validators.required, Validators.min(0.5)]}],
        imageUrl: ['', {validators: [Validators.required, FormValidator.checkNotOnlyWhitespace]}],
        unitsInStock: [null, {validators: [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]}],
        isActive: [false] 
      });
  }
  
  fillProductCategories() {
    this.productCategoryService.getActiveProductCategories().subscribe(
      data => { this.productCategories = data; },
    );
  }
  
  editProduct() {
    if (this.productFormGroup.invalid) {
        this.productFormGroup.markAllAsTouched();
        return;
    }

    const productId: number = this.getProductId();
      
    this.isDisabled = true;
    const name = this.productFormGroup.controls['name'].value;
    const description = this.productFormGroup.controls['description'].value;
    const categoryId = this.productFormGroup.controls['categoryId'].value;
    const unitPrice = this.productFormGroup.controls['unitPrice'].value;
    const imageUrl = this.productFormGroup.controls['imageUrl'].value;
    const unitsInStock = this.productFormGroup.controls['unitsInStock'].value;
    const isActive = this.productFormGroup.controls['isActive'].value;
    const product = new EditProduct(name, description, unitPrice, imageUrl, unitsInStock, categoryId, isActive);
          
    this.productService.editProduct(productId, product).subscribe({
        next: (data) => {
          this.isDisabled = false;
          this.productFormGroup.reset();
          
          this.router.navigateByUrl('/');
          this.toastService.show({message: 'Product edited successfully', className: 'bg-success-toast text-light' });
        },
        error: (err) => {
          this.isDisabled = false;
          this.toastService.show({message: `Error editing product: ${err.error.message}`, className: 'bg-danger text-light' });
        }
      });
    }

  fillProduct() {
    const productId: number = this.getProductId();

    this.productService.getProductForAdmin(productId).subscribe(
      data => {
        this.name?.setValue(data.name);
        this.description?.setValue(data.description);

        // Set the unit price based on the main currency
        if(this.currencyService.showBgnCurrencyFirstParam?.value == "1") {
          this.unitPrice?.setValue(data.unitPrice);
        } else {
          this.unitPrice?.setValue(data.unitPriceEur);
        }

        this.categoryId?.setValue(data.category.id);
        this.imageUrl?.setValue(data.imageUrl);
        this.unitsInStock?.setValue(data.unitsInStock);
        this.isActive?.setValue(data.isActive);
      }
    );
  }  
  
  getProductId() {
    return +this.route.snapshot.paramMap.get('id')!;
  }  

  get name() {
    return this.productFormGroup.get('name');
  }
  
  get description() {
    return this.productFormGroup.get('description');
  }
  
  get categoryId() {
    return this.productFormGroup.get('categoryId');
  }
  
  get unitPrice() {
    return this.productFormGroup.get('unitPrice');
  }
  
  get imageUrl() {
    return this.productFormGroup.get('imageUrl');
  }
  
  get unitsInStock() {
    return this.productFormGroup.get('unitsInStock');
  }
  
  get isActive() {
    return this.productFormGroup.get('isActive');
  }
}
