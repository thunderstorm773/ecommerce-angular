import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private baseUrl = 'https://localhost:8443/api/product-categories';
  
  constructor(private httpClient: HttpClient) { }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response.content)
    );
  }
}

interface GetResponse {
  content: ProductCategory[]
}
