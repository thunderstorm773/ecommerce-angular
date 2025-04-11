import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  standalone: false,
  
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent implements OnInit {
  
  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = localStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      // Get username of logged in user
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
          
          const userEmail = res.email;
          this.storage.setItem('userEmail', JSON.stringify(userEmail));
        }
      );
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }
}
