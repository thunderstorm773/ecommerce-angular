import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list-grid.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number | null = null;
  currentCategoryName: string | null = '';

  constructor(private productService: ProductService,
              private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Query params
    this.route.queryParamMap.subscribe(params => {
        this.currentCategoryName = params.get('name');
    });
    
    // path params
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      this.productService.getProductListByCategory(this.currentCategoryId).subscribe(
        data => {
          this.products = data;
        }
      );
      
    } else {
      this.productService.getProductList().subscribe(
        data => {
          this.products = data
        }
      );
    }
  }
}
