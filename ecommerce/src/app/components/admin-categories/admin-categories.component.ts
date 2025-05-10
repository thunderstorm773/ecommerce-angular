import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductCategoryService } from '../../services/product-category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: false,
  
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {

   productCategories: ProductCategory[] = [];
  
    // pagination properties
    currentPageNumber: number = 1;
    pageSize: number = 20;
    totalElements: number = 0;
    
    constructor(private productCategoryService: ProductCategoryService) { }
  
    ngOnInit(): void {
      this.listProductCategories();
    }
  
    listProductCategories() {
      this.productCategoryService.getProductCategories(this.currentPageNumber, this.pageSize)
                                 .subscribe(data => this.processResult(data));
    }
  
    updatePageSize(pageSize: string) {
      this.pageSize = +pageSize;
      this.currentPageNumber = 1;
      this.listProductCategories();
    }
  
    processResult(data: any) {
      this.productCategories = data.content;
      this.currentPageNumber = data.number + 1;
      this.pageSize = data.size;
      this.totalElements = data.totalElements;
    }

}
