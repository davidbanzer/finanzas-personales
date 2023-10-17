import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiConfigService } from './api-config.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private apiConfig: ApiConfigService) { }

  register(user: any){
    const url = `${this.API_URL}/auth/register`;
    const body = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    }

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.post(url, body, {headers});
  }

  login(user: any){
    const url = `${this.API_URL}/auth/login`;
    const body = {
      email: user.email,
      password: user.password
    }

    const headers = this.apiConfig.getHeadersWithoutToken();
    
    return this.http.post(url, body, {headers});
  }
}
