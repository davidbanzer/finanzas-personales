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
}
