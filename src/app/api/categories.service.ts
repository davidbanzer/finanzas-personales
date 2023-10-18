import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  
  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
    ) { }

  getCategoriesByUserId(userId: string){
    const url = `${this.API_URL}/categories/${userId}`;

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.get(url, {headers});
  }

  addCategory(userId: string, category: any){
    const url = `${this.API_URL}/categories`;
    const body = {
      name: category.name,
      description: category.description,
      userId: userId
    }

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.post(url, body, {headers});
  }

  updateCategory(userId: string, category: any){
    const url = `${this.API_URL}/categories/${category.id}`;
    const body = {
      name: category.name,
      description: category.description,
      userId: userId
    }

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.put(url, body, {headers});
  }

  deleteCategory(categoryId: string){
    const url = `${this.API_URL}/categories/${categoryId}`;

    const headers = this.apiConfig.getHeadersWithToken();

    return this.http.delete(url, {headers});
  }
}
