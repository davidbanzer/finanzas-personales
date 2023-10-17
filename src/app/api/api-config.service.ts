import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private headersWithToken: HttpHeaders;
  private headersWithoutToken: HttpHeaders;

  constructor() {
    this.headersWithToken = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    this.headersWithoutToken = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  getHeadersWithToken(): HttpHeaders {
    return this.headersWithToken;
  }

  getHeadersWithoutToken(): HttpHeaders {
    return this.headersWithoutToken;
  }

  getToken(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token;
  }
}
