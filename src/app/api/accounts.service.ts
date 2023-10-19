import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private apiConfig: ApiConfigService) { }

  getAccountsByUserId(userId: number) {
    const url = `${this.API_URL}/accounts/${userId}`;

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.get(url, {headers});
  }

  getBalanceByAccountId(accountId: string) {
    const url = `${this.API_URL}/accounts/balance/${accountId}`;

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.get(url, {headers});
  }

  addAccount(userId: string, account: any) {
    const url = `${this.API_URL}/accounts`;

    const body = {
      name: account.name,
      description: account.description,
      initialBalance: account.initialBalance,
      userId: userId
    }

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.post(url, body, {headers});
  }

}
