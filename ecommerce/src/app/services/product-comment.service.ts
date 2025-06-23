import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AddProductComment } from '../common/add-product-comment';
import { ProductComment } from '../common/product-comment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductCommentService {

  private commentURL: string = environment.ecommerceURL + 'comments';

  constructor(private httpClient: HttpClient) { }

  getCommentsByProductPaginate(productId: number, 
                               currentPageNumber: number, 
                               pageSize: number) {
      const commentUrl = `${this.commentURL}/product/${productId}?page=${currentPageNumber}&size=${pageSize}`;
      return this.httpClient.get<GetResponseProductComment>(commentUrl);                            
  }

  createComment(comment: AddProductComment) {
    const commentUrl = `${this.commentURL}/add`;
    return this.httpClient.post<AddProductComment>(commentUrl, comment);
  }

  deleteComment(id: number): Observable<any> {
    const couponUrl = `${this.commentURL}/delete/${id}`;
    return this.httpClient.delete(couponUrl);
  }
}

interface GetResponseProductComment {
  content: ProductComment[];
}


