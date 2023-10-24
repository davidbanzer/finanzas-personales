import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private apiConfig: ApiConfigService) { }

  getMovementsByUserId(userId: string) {
    const url = `${this.API_URL}/movements/all/${userId}`;
    
    const headers = this.apiConfig.getHeadersWithToken();
    
    return this.http.get(url, {headers});
  }

  getMovementsByDate(userId: string, month:string){
    const url = `${this.API_URL}/movements/all/${userId}`;

    const headers = this.apiConfig.getHeadersWithToken();

    const body = {
      month
    }

    return this.http.post(url, body, {headers});
  }

  addMovement(movement: any){
    const url = `${this.API_URL}/movements`;

    const body = {
      description: movement.description,
      amount: movement.amount,
      type: movement.type,
      createdDate: movement.createdDate,
      categoryId: movement.categoryId,
      accountId: movement.accountId
    }

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.post(url, body, {headers});
  }

  updateMovement(movement: any){
    const url = `${this.API_URL}/movements/${movement.id}`;

    const body = {
      description: movement.description,
      amount: movement.amount,
      type: movement.type,
      createdDate: movement.createdDate,
      categoryId: movement.categoryId,
      accountId: movement.accountId
    }

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.put(url, body, {headers});
  }

  deleteMovement(movementId: string){
    const url = `${this.API_URL}/movements/${movementId}`;

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.delete(url, {headers});
  }
}
