import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.ecommerceURL + 'products';
  private adminBaseUrl = environment.ecommerceURL + 'admin/products';

  constructor(private httpClient: HttpClient) {}

  getProductListPaginate(currentPageNumber: number,
                         pageSize: number): Observable<GetResponseMany> {
  
    return this.getProductsPaginate(this.baseUrl, currentPageNumber, pageSize);
  }

  getProductListByCategory(productCategoryId: number,
                           currentPageNumber: number,
                           pageSize: number): Observable<GetResponseMany> {
    const searchByCategoryUrl = `${this.baseUrl}/category/${productCategoryId}`;
    
    return this.getProductsPaginate(searchByCategoryUrl, currentPageNumber, pageSize);
  }

  searchProducts(nameKeyword: string,
                 currentPageNumber: number,
                 pageSize: number): Observable<GetResponseMany> {
    const searchByNameUrl = `${this.baseUrl}?name=${nameKeyword}`;

    return this.getProductsPaginate(searchByNameUrl, currentPageNumber, pageSize);
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  publishProduct(productId: number): Observable<Product> {
    const productUrl = `${this.adminBaseUrl}/publish/${productId}`;
    return this.httpClient.post<Product>(productUrl, {});
  }

  unpublishProduct(productId: number): Observable<Product> {
    const productUrl = `${this.adminBaseUrl}/unpublish/${productId}`;
    return this.httpClient.post<Product>(productUrl, {});
  }

  private getProductsPaginate(url: string, 
                              currentPageNumber: number,
                              pageSize: number): Observable<GetResponseMany> {
    if (url.includes('?')) {
      url = url + `&page=${currentPageNumber}&size=${pageSize}`
    } else {
      url = url + `?page=${currentPageNumber}&size=${pageSize}`
    }
 
    return this.httpClient.get<GetResponseMany>(url);
  }
}

interface GetResponseMany {
  content: Product[];
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
