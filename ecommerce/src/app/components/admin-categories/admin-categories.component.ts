import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductCategoryService } from '../../services/product-category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

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
    
    constructor(private productCategoryService: ProductCategoryService,
                private toastService: ToastService) { }
  
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
            this.toastService.show({message: 'Category deactivated successfully', className: 'bg-success-toast text-light' });
    
            this.listProductCategories();
            this.productCategoryService.notifyRefreshActiveProductCategories();
          },
          error: (err) => {
            this.toastService.show({message: `Error deactivating category: ${err.error.message}`,
                                    className: 'bg-danger text-light' });
          }
        });
      }
    }

    activateProductCategory(productCategoryId?: number) {
      if (productCategoryId) {
        this.modalService.dismissAll();

        this.productCategoryService.activateProductCategory(productCategoryId).subscribe({
          next: (data) => {
            this.toastService.show({message: 'Category activated successfully', className: 'bg-success-toast text-light' });
    
            this.listProductCategories();
            this.productCategoryService.notifyRefreshActiveProductCategories();
          },
          error: (err) => {
            this.toastService.show({message: `Error activating category: ${err.error.message}`, 
                                    className: 'bg-danger text-light' });
          }
        });
      }
    }
}
