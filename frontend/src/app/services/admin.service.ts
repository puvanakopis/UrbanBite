import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Role, User } from '../models/auth.models';
import { Restaurant } from '../models/restaurant.models';
import { Order, OrderStatus } from '../models/order.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  public getPlatformStats(): Observable<ApiResponse<Record<string, any>>> {
    return this.http.get<ApiResponse<Record<string, any>>>(`${this.apiUrl}/stats`);
  }

  public getUsers(role?: Role): Observable<ApiResponse<User[]>> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`, { params });
  }

  public toggleUserActive(userId: number): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/users/${userId}/toggle-active`, {});
  }

  public getAllRestaurants(): Observable<ApiResponse<Restaurant[]>> {
    return this.http.get<ApiResponse<Restaurant[]>>(`${this.apiUrl}/restaurants`);
  }

  public updateRestaurantStatus(restaurantId: number, status: string): Observable<ApiResponse<Restaurant>> {
    return this.http.patch<ApiResponse<Restaurant>>(`${this.apiUrl}/restaurants/${restaurantId}/status`, { status });
  }

  public getAllOrders(status?: OrderStatus): Observable<ApiResponse<Order[]>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}/orders`, { params });
  }
}
