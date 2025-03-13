import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private baseUrl =  environment.ecommerceURL + 'product-categories';
  
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
