import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.models';
import { MenuCategory, MenuItem } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly apiUrl = 'http://localhost:8080/api/menu';

  constructor(private http: HttpClient) {}

  public getCategories(restaurantId: number): Observable<ApiResponse<MenuCategory[]>> {
    return this.http.get<ApiResponse<MenuCategory[]>>(`${this.apiUrl}/restaurant/${restaurantId}/categories`);
  }

  public getItems(restaurantId: number, publicOnly: boolean = true): Observable<ApiResponse<MenuItem[]>> {
    return this.http.get<ApiResponse<MenuItem[]>>(`${this.apiUrl}/restaurant/${restaurantId}/items?publicOnly=${publicOnly}`);
  }

  public createCategory(restaurantId: number, name: string, displayOrder?: number): Observable<ApiResponse<MenuCategory>> {
    return this.http.post<ApiResponse<MenuCategory>>(`${this.apiUrl}/restaurant/${restaurantId}/categories`, { name, displayOrder });
  }

  public deleteCategory(categoryId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/categories/${categoryId}`);
  }

  public createItem(restaurantId: number, item: Partial<MenuItem>, categoryId?: number): Observable<ApiResponse<MenuItem>> {
    const url = categoryId 
      ? `${this.apiUrl}/restaurant/${restaurantId}/items?categoryId=${categoryId}` 
      : `${this.apiUrl}/restaurant/${restaurantId}/items`;
    return this.http.post<ApiResponse<MenuItem>>(url, item);
  }

  public updateItem(itemId: number, item: Partial<MenuItem>): Observable<ApiResponse<MenuItem>> {
    return this.http.put<ApiResponse<MenuItem>>(`${this.apiUrl}/items/${itemId}`, item);
  }

  public toggleAvailability(itemId: number): Observable<ApiResponse<MenuItem>> {
    return this.http.patch<ApiResponse<MenuItem>>(`${this.apiUrl}/items/${itemId}/toggle-availability`, {});
  }

  public deleteItem(itemId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/items/${itemId}`);
  }
}
