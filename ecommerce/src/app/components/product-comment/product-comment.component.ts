import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { ToastService } from '../../services/toast.service';
import { FormValidator } from '../../validators/form-validator';
import { AddProductComment } from '../../common/add-product-comment';
import { ProductCommentService } from '../../services/product-comment.service';
import { ActivatedRoute } from '@angular/router';
import { ProductComment } from '../../common/product-comment';
import OktaAuth from '@okta/okta-auth-js';

@Component({
  selector: 'app-product-comment',
  standalone: false,
  
  templateUrl: './product-comment.component.html',
  styleUrl: './product-comment.component.css'
})
export class ProductCommentComponent implements OnInit {

  productComments: ProductComment[] = [];
  commentFormGroup!: FormGroup;
  isDisabled: boolean = false;
  isAuthenticated: boolean = false;
  userEmail: string = '';
  isAdmin: boolean = false;

  // pagination properties
  currentPageNumber: number = 1;
  pageSize: number = 20;
  totalElements: number = 0;

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private productCommentService: ProductCommentService,
              private toastService: ToastService) { }

  ngOnInit(): void {
      // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );

    this.createCommentFormGroup();
    this.listProductCommentsByProduct();
  }

  createCommentFormGroup() {
    this.commentFormGroup = this.formBuilder.group({
          comment: ['', {validators: [Validators.required, Validators.minLength(20), FormValidator.checkNotOnlyWhitespace]
          }]
      });
  }

  listProductCommentsByProduct() {
    const productId: number = this.getProductId();
    this.productCommentService.getCommentsByProductPaginate(productId, this.currentPageNumber, this.pageSize)
                              .subscribe(data => this.processResult(data));
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.currentPageNumber = 1;
    this.listProductCommentsByProduct();
  }

  processResult(data: any) {
    this.productComments = data.content;
    this.currentPageNumber = data.number + 1;
    this.pageSize = data.size;
    this.totalElements = data.totalElements;
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      // Get username of logged in user
      this.oktaAuth.getUser().then(
        (res) => {
          this.userEmail = res.email as string;

          // Check if user is in the Admin group
          if (Array.isArray(res['groups']) && res['groups'].includes('Admin')) {
            this.isAdmin = true;
          }
        }
      );
    }
  }

  canUserManageComment(authorComment: string): boolean {
    if (!this.isAuthenticated) {
      return false;
    }
    
    if (this.isAdmin) {
      return true;
    }

    if(this.userEmail == authorComment) {
      return true;
    }

    return false;
  }

  postComment() {
    if (this.commentFormGroup.invalid) {
      this.commentFormGroup.markAllAsTouched();
      return;
    }

    const productId: number = this.getProductId();
    
    this.isDisabled = true;
    const comment = this.commentFormGroup.controls['comment'].value;
    const newComment = new AddProductComment(comment, productId);
    
    this.productCommentService.createComment(newComment).subscribe({
          next: (data) => {
            this.isDisabled = false;
            this.commentFormGroup.reset();
            this.listProductCommentsByProduct();

            this.toastService.show({message: 'Comment posted successfully', className: 'bg-success-toast text-light' });
          },
          error: (err) => {
            this.isDisabled = false;
            this.toastService.show({message: `Error posting comment: ${err.error.message}`, className: 'bg-danger text-light' });
          }
    });
  }

  getProductId() {
    return +this.route.snapshot.paramMap.get('id')!;
  }

  get comment() {
    return this.commentFormGroup.get('comment');
  }
}
