import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-add-product',
  standalone: false,
  
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.css'
})
export class AdminAddProductComponent implements OnInit {

  productFormGroup!: FormGroup;
  isDisabled: boolean = false;
    
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private productService: ProductService, 
              private toastService: ToastService) {}
  
  
  ngOnInit(): void {
    
  }
}
