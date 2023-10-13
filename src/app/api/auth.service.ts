import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { headersWithoutToken } from '../constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  register(user: any){
    const body = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    }

    const headers = headersWithoutToken;

    return this.http.post(`${this.API_URL}/auth/register`, body, headers);
  }

  login(user: any){
    const body = {
      email: user.email,
      password: user.password
    }

    const headers = headersWithoutToken;

    return this.http.post(`${this.API_URL}/auth/login`, body, headers);
  }
}
