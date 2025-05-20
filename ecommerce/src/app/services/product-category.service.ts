import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private productCategoryBaseUrl =  environment.ecommerceURL + 'product-categories';
  private productCategoryAdminBaseUrl =  environment.ecommerceURL + 'admin/product-categories';
  
  constructor(private httpClient: HttpClient) { }

  getActiveProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(this.productCategoryBaseUrl);
  }

  getProductCategories(currentPageNumber: number, 
                       pageSize: number): Observable<GetProductCategoryResponse> {

    
    const productCategoryUrl = `${this.productCategoryAdminBaseUrl}?page=${currentPageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetProductCategoryResponse>(productCategoryUrl);
  }

  getProductCategoryById(id: number): Observable<ProductCategory> {
    const productCategoryUrl = `${this.productCategoryAdminBaseUrl}/${id}`;
    return this.httpClient.get<ProductCategory>(productCategoryUrl);
  }

  getProductCategoryByName(name: string): Observable<ProductCategory> {
    const productCategoryUrl = `${this.productCategoryBaseUrl}/name/${name}`;
    return this.httpClient.get<ProductCategory>(productCategoryUrl);
  }
}

interface GetProductCategoryResponse {
  content: ProductCategory[]
}
