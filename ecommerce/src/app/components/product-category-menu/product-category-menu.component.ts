import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductCategoryService } from '../../services/product-category.service';

@Component({
  selector: 'app-product-category-menu',
  standalone: false,
  
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent implements OnInit {

  activeProductCategories: ProductCategory[] = [];

  constructor(private productCategoryService: ProductCategoryService) {}


  ngOnInit(): void {
    this.listActiveProductCategories();
  }

  listActiveProductCategories() {
    this.productCategoryService.getActiveProductCategories().subscribe(
      data => {
        this.activeProductCategories = data
      }
    );
  }
}
