import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private productCategoryUrl =  environment.ecommerceURL + 'product-categories';
  private productCategoryAdminBaseUrl =  environment.ecommerceURL + 'admin/product-categories';
  
  constructor(private httpClient: HttpClient) { }

  getActiveProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(this.productCategoryUrl);
  }

  getProductCategories(currentPageNumber: number, 
                       pageSize: number): Observable<GetProductCategoryResponse> {

    
    const productCategoryAdminUrl = `${this.productCategoryAdminBaseUrl}?page=${currentPageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetProductCategoryResponse>(productCategoryAdminUrl);
  }
}

interface GetProductCategoryResponse {
  content: ProductCategory[]
}
