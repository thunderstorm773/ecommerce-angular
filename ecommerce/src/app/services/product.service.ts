import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) {}

  getProductList(): Observable<Product[]> {
    return this.getProducts(this.baseUrl);
  }

  getProductListByCategory(productCategoryId: number): Observable<Product[]> {
    const searchByCategoryUrl = `${this.baseUrl}/category/${productCategoryId}`;
    
    return this.getProducts(searchByCategoryUrl);
  }

  searchProducts(nameKeyword: string): Observable<Product[]> {
    const searchByNameUrl = `${this.baseUrl}?name=${nameKeyword}`;

    return this.getProducts(searchByNameUrl);
  }

  private getProducts(url: string): Observable<Product[]> {
    return this.httpClient.get<GetResponse>(url).pipe(
      map(response => response.content)
    );
  }
}

interface GetResponse {
  content: Product[]
}
