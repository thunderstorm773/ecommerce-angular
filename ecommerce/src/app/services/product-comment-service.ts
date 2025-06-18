import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { ProductComment } from "../common/product-comment";
import { AddProductComment } from "../common/add-product-comment";

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
}

interface GetResponseProductComment {
    content: ProductComment[];
}
