import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SystemParameter } from '../common/system-parameter';
import { Observable } from 'rxjs';
import { AddSystemParameter } from '../common/add-system-parameter';

@Injectable({
  providedIn: 'root'
})
export class SystemParameterService {

  private systemParameterBaseUrl: string = environment.ecommerceURL + 'system-parameters';
  private systemParameterAdminBaseUrl: string = environment.ecommerceURL + 'admin/system-parameters';

  constructor(private httpClient: HttpClient) { }

  getSystemParametersPaginate(currentPageNumber: number, 
                              pageSize: number) :  Observable<GetSystemParameterResponse> {
                                
      const systemParameterUrl = `${this.systemParameterAdminBaseUrl}?page=${currentPageNumber}&size=${pageSize}`;
      return this.httpClient.get<GetSystemParameterResponse>(systemParameterUrl);                            
  }

  getSystemParameter(systemParameterId: number): Observable<SystemParameter> {
      
      const systemParameterUrl = `${this.systemParameterAdminBaseUrl}/${systemParameterId}`;
      return this.httpClient.get<SystemParameter>(systemParameterUrl);
  }

  getSystemParameterByCode(code: string): Observable<SystemParameter> {
      
      const systemParameterUrl = `${this.systemParameterBaseUrl}/code/${code}`;
      return this.httpClient.get<SystemParameter>(systemParameterUrl);
  }

  createSystemParameter(systemParameter: AddSystemParameter): Observable<any> {
    const systemParameterUrl = `${this.systemParameterAdminBaseUrl}/add`;
    return this.httpClient.post<AddSystemParameter>(systemParameterUrl, systemParameter);
  }
}

interface GetSystemParameterResponse {
  content: SystemParameter[];
}
