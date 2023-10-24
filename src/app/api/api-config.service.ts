import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private headersWithToken: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  private headersWithoutToken: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  getHeadersWithToken(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      this.headersWithToken = this.headersWithToken.set('Authorization', `Bearer ${token}`);
    }
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
