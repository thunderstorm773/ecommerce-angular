import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-list',
  standalone: false,

  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list-grid.component.css',
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number | null = null;
  previousCategoryId: number | null = null;
  currentCategoryName: string | null = '';
  searchMode: boolean = false;

  selectedProductId?: number;
  modalService = inject(NgbModal);

  // pagination properties
  currentPageNumber: number = 1;
  pageSize: number = 20;
  totalElements: number = 0;

  previousNameKeyword: string | null = null;

  constructor(public currencyService: CurrencyService,
              private productService: ProductService,
              private cartService: CartService,
              private toastService: ToastService,
              private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    await this.currencyService.initSystemParams();
    
    // Query params
    this.route.queryParamMap.subscribe(params => {
      this.currentCategoryName = params.get('categoryName');
      this.listProducts();
    });

    // path params
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.queryParamMap.has('name');

    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const nameKeyword: string = this.route.snapshot.queryParamMap.get('name')!;
    
    // if we have a different name keyword than previous
    if (this.previousNameKeyword != nameKeyword) {
      this.currentPageNumber = 1;
    }

    this.previousNameKeyword = nameKeyword;

    // search for products using keyword
    this.productService.searchProducts(nameKeyword, this.currentPageNumber, this.pageSize)
                       .subscribe(data => this.processResult(data));
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      // If we have different category id than previous
      if(this.previousCategoryId != this.currentCategoryId) {
        this.currentPageNumber = 1;
      }

      this.previousCategoryId = this.currentCategoryId;

      this.productService.getProductListByCategory(this.currentCategoryId, this.currentPageNumber, this.pageSize)
                         .subscribe(data => this.processResult(data));
    } else {
      this.productService.getProductListPaginate(this.currentPageNumber, this.pageSize)
                         .subscribe(data => this.processResult(data));
    }
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.currentPageNumber = 1;
    this.listProducts();
  }

  processResult(data: any) {
    this.products = data.content;
    this.currentPageNumber = data.number + 1;
    this.pageSize = data.size;
    this.totalElements = data.totalElements;
  }

  addToCart(product: Product) {

    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

  open(content: TemplateRef<any>, productId: number) {
    this.selectedProductId = productId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  publishProduct(productId?: number) {
  }

  unpublishProduct(productId?: number) {
  }
}
