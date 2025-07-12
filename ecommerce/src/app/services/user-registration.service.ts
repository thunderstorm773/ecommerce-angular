import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUser } from '../common/register-user';
import { Observable } from 'rxjs';
import appConfig from '../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  constructor(private httpClient: HttpClient) { }

  registerUser(user: RegisterUser): Observable<any> {
    const payload = {
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        login: user.email
      },
      credentials: {
        password: {
          value: user.password
        }
      }
    };

    const registerUserUrl = `${appConfig.oidc.domain}/api/v1/users?activate=true`;
    return this.httpClient.post(registerUserUrl, payload, {
      headers: {
        Authorization: 'SSWS ' + appConfig.oidc.apiToken,
        'Content-Type': 'application/json'
      }
    });
  }
}
