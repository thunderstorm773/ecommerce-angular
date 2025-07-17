import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';
import { CurrencyService } from '../../services/currency.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-details',
  standalone: false,
  
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  
  product!: Product;
  selectedProductId?: number;
  modalService = inject(NgbModal);

  constructor(public currencyService: CurrencyService,
              private productService: ProductService,
              private cartService: CartService,
              private toastService: ToastService,
              private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    await this.currencyService.initSystemParams();
    
    this.route.paramMap.subscribe(() => {
        this.handleProductDetails();
    });
  }

  handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(productId).subscribe(
      data => {
        this.product = data
      }
    );
  }

  addToCart() {
    const cartItem = new CartItem(this.product);
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
