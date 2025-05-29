import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment';
import { AddProductCategory } from '../common/add-product-category';
import { EditProductCategory } from '../common/edit-product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private _refreshActiveProductCategories = new Subject<void>();
  private productCategoryBaseUrl =  environment.ecommerceURL + 'product-categories';
  private productCategoryAdminBaseUrl =  environment.ecommerceURL + 'admin/product-categories';
  
  constructor(private httpClient: HttpClient) { }

  notifyRefreshActiveProductCategories() {
    this._refreshActiveProductCategories.next();
  }

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

  canEditProductCategoryName(id: number | null, name: string): Observable<ProductCategory> {
    const queryString = id ? `id=${id}&name=${name}` : `name=${name}`;
    const productCategoryUrl = `${this.productCategoryAdminBaseUrl}/can-edit-name?${queryString}`;
    return this.httpClient.get<ProductCategory>(productCategoryUrl);
  }

  createProductCategory(productCategory: AddProductCategory): Observable<any> {
    const productCategoryUrl = `${this.productCategoryAdminBaseUrl}/add`;
    return this.httpClient.post<AddProductCategory>(productCategoryUrl, productCategory);
  }

  editProductCategory(id: number, productCategory: EditProductCategory): Observable<any> {
    const productCategoryUrl = `${this.productCategoryAdminBaseUrl}/edit/${id}`;
    return this.httpClient.put<EditProductCategory>(productCategoryUrl, productCategory);
  }

  deactivateProductCategory(id: number): Observable<any> {
    const productCategoryUrl = `${this.productCategoryAdminBaseUrl}/deactivate/${id}`;
    return this.httpClient.post(productCategoryUrl, null);
  }

  activateProductCategory(id: number): Observable<any> {
    const productCategoryUrl = `${this.productCategoryAdminBaseUrl}/activate/${id}`;
    return this.httpClient.post(productCategoryUrl, null);
  }

  get refreshActiveProductCategories() {
    return this._refreshActiveProductCategories.asObservable();
  }
}

interface GetProductCategoryResponse {
  content: ProductCategory[]
}
