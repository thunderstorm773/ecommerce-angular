import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,

  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list-grid.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number | null = null;
  currentCategoryName: string | null = '';
  searchMode: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
    
    // search for products using keyword
    this.productService.searchProducts(nameKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      this.productService
        .getProductListByCategory(this.currentCategoryId)
        .subscribe((data) => {
          this.products = data;
        });
    } else {
      this.productService.getProductList().subscribe((data) => {
        this.products = data;
      });
    }
  }
}
