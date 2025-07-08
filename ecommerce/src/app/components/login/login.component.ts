import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';

import appConfig from '../../config/app-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  oktaSignIn: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
              private router: Router) { }

  ngOnDestroy(): void {
    this.oktaSignIn.remove();
  }

  ngOnInit(): void {
    this.oktaSignIn = new OktaSignIn({
      logo: appConfig.oidc.logo,
      authClient: this.oktaAuth
    });

    this.oktaSignIn.renderEl({
      el: '#okta-sign-in-widget'},
      async (response: any) => {
        if (response.status === 'SUCCESS') {
          await this.oktaAuth.handleLoginRedirect(response.tokens);
          await this.router.navigate(['/products']);
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }
}
