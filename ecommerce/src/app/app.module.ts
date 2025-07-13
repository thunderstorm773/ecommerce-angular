import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list-grid.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { ProductCategoryService } from './services/product-category.service';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { OktaAuthModule, OktaCallbackComponent, OKTA_CONFIG, OktaAuthGuard } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import appConfig from './config/app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { AdminCategoriesComponent } from './components/admin-categories/admin-categories.component';
import { AuthGroupGuard } from './guards/auth-group.guard';
import { AdminAddCategoryComponent } from './components/admin-add-category/admin-add-category.component';
import { AdminEditCategoryComponent } from './components/admin-edit-category/admin-edit-category.component';
import { ToastComponent } from './components/toast/toast.component';
import { AdminCouponsComponent } from './components/admin-coupons/admin-coupons.component';
import { AdminAddCouponComponent } from './components/admin-add-coupon/admin-add-coupon.component';
import { AdminEditCouponComponent } from './components/admin-edit-coupon/admin-edit-coupon.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ProductCommentComponent } from './components/product-comment/product-comment.component';
import { AdminSystemParametersComponent } from './components/admin-system-parameters/admin-system-parameters.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminAddSystemParameterComponent } from './components/admin-add-system-parameter/admin-add-system-parameter.component';

const oktaConfig = appConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  const router = injector.get(Router);
  router.navigate(['/login']);
}

const routes: Routes = [
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard],
                    data: {onAuthRequired: sendToLoginPage}},
  {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard],
                    data: {onAuthRequired: sendToLoginPage}},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'products/category/:id', component: ProductListComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'checkout', component: CheckoutComponent, canActivate: [OktaAuthGuard],
                     data: {onAuthRequired: sendToLoginPage}
  },
  {path: 'admin/categories', component: AdminCategoriesComponent, canActivate: [OktaAuthGuard, AuthGroupGuard],
    data: {onAuthRequired: sendToLoginPage, groups: ['Admin']},
  },
  {path: 'admin/categories/add', component: AdminAddCategoryComponent, canActivate: [OktaAuthGuard, AuthGroupGuard],
    data: {onAuthRequired: sendToLoginPage, groups: ['Admin']},
  },
  {path: 'admin/categories/edit/:id', component: AdminEditCategoryComponent, canActivate: [OktaAuthGuard, AuthGroupGuard],
    data: {onAuthRequired: sendToLoginPage, groups: ['Admin']},
  },
  {path: 'admin/coupons', component: AdminCouponsComponent, canActivate: [OktaAuthGuard, AuthGroupGuard],
    data: {onAuthRequired: sendToLoginPage, groups: ['Admin']},
  },
  {path: 'admin/coupons/add', component: AdminAddCouponComponent, canActivate: [OktaAuthGuard, AuthGroupGuard],
    data: {onAuthRequired: sendToLoginPage, groups: ['Admin']},
  },
  {path: 'admin/coupons/edit/:id', component: AdminEditCouponComponent, canActivate: [OktaAuthGuard, AuthGroupGuard],
    data: {onAuthRequired: sendToLoginPage, groups: ['Admin']},
  },
  {path: 'admin/system-parameters', component: AdminSystemParametersComponent, canActivate: [OktaAuthGuard, AuthGroupGuard],
    data: {onAuthRequired: sendToLoginPage, groups: ['Admin']},
  },
  {path: 'admin/system-parameters/add', component: AdminAddSystemParameterComponent, canActivate: [OktaAuthGuard, AuthGroupGuard],
    data: {onAuthRequired: sendToLoginPage, groups: ['Admin']},
  },
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'contact-us', component: ContactUsComponent},
  {path: '', redirectTo: 'products', pathMatch: 'full'},
  {path: '**', redirectTo: 'products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent,
    AboutUsComponent,
    ContactUsComponent,
    AdminCategoriesComponent,
    AdminAddCategoryComponent,
    AdminEditCategoryComponent,
    ToastComponent,
    AdminCouponsComponent,
    AdminAddCouponComponent,
    AdminEditCouponComponent,
    ProductCommentComponent,
    AdminSystemParametersComponent,
    RegisterComponent,
    AdminAddSystemParameterComponent
  ],
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    }),
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule,
    GoogleMapsModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi()), ProductService, ProductCategoryService, 
             {provide: OKTA_CONFIG, useValue: { oktaAuth }}, 
             {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}, 
             DatePipe, CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
