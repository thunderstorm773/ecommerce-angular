import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { OKTA_AUTH } from "@okta/okta-angular";
import OktaAuth from "@okta/okta-auth-js";

@Injectable({
  providedIn: 'root'
})
export class AuthGroupGuard implements CanActivate {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
              private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const requiredGroups: string[] = route.data['groups'] || [];

    try {
      const user = await this.oktaAuth.getUser();
      const userGroups: string[] = (user as any).groups || [];

      const hasAccess = requiredGroups.some(group => userGroups.includes(group));
      if (hasAccess) {
        return true;
      }

      return false;
      
    } catch (error) {
      console.error('Error fetching user groups:', error);
      return false;
    }
  }
}
