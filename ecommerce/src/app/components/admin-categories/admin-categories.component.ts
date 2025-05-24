import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductCategoryService } from '../../services/product-category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-categories',
  standalone: false,
  
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {

   productCategories: ProductCategory[] = [];
   selectedProductCategoryId?: number;
   modalService = inject(NgbModal);
  
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

    open(content: TemplateRef<any>, productCategoryId: number) {
      this.selectedProductCategoryId = productCategoryId;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
    }

    deactivateProductCategory(productCategoryId?: number) {
      if (productCategoryId) {
        this.modalService.dismissAll();

        this.productCategoryService.deactivateProductCategory(productCategoryId).subscribe({
          next: (data) => {
            alert(`Category deactivated successfully`);
    
            this.listProductCategories();
            this.productCategoryService.notifyRefreshActiveProductCategories();
          },
          error: (err) => {
            alert(`Error deactivating category: ${err.error.message}`);
          }
        });
      }
    }

    activateProductCategory(productCategoryId?: number) {
      console.log(`Activate product category id: ${productCategoryId}`);
    }
}
