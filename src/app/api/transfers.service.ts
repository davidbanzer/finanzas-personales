import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class TransfersService {
  private API_URL = environment.API_URL;
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  addTransfer(transfer: any){
    const url = `${this.API_URL}/transfers`;

    const body = {
      description: transfer.description,
      amount: transfer.amount,
      originAccountId: transfer.originAccountId,
      destinationAccountId: transfer.destinationAccountId,
      categoryId: transfer.categoryId,
      createdDate: transfer.createdDate
    }

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.post(url, body, {headers});
  }

  getTransfersByUserId(userId: string){
    const url = `${this.API_URL}/transfers/all/${userId}`;

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.get(url, {headers});
  }

  deleteTransfer(transferId: string){
    const url = `${this.API_URL}/transfers/${transferId}`;

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.delete(url, {headers});
  }

}
