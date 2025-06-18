import { Component, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';

@Component({
  selector: 'app-product-comment',
  standalone: false,
  
  templateUrl: './product-comment.component.html',
  styleUrl: './product-comment.component.css'
})
export class ProductCommentComponent implements OnInit {

  isAuthenticated: boolean = false;

  constructor(private oktaAuthService: OktaAuthStateService) { }

  ngOnInit(): void {
      // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
      }
    );
  }
}
