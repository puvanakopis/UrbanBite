import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.models';
import { Restaurant } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly apiUrl = 'http://localhost:8080/api/restaurants';

  constructor(private http: HttpClient) { }

  public getRestaurants(search?: string, cuisine?: string): Observable<ApiResponse<Restaurant[]>> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (cuisine) params = params.set('cuisine', cuisine);
    return this.http.get<ApiResponse<Restaurant[]>>(this.apiUrl, { params });
  }

  public getRestaurantById(id: number): Observable<ApiResponse<Restaurant>> {
    return this.http.get<ApiResponse<Restaurant>>(`${this.apiUrl}/${id}`);
  }

  public getMyRestaurant(): Observable<ApiResponse<Restaurant>> {
    return this.http.get<ApiResponse<Restaurant>>(`${this.apiUrl}/owner/my-restaurant`);
  }

  public updateMyRestaurant(restaurant: Partial<Restaurant>): Observable<ApiResponse<Restaurant>> {
    return this.http.put<ApiResponse<Restaurant>>(`${this.apiUrl}/owner/my-restaurant`, restaurant);
  }

  public toggleOpenStatus(): Observable<ApiResponse<Restaurant>> {
    return this.http.post<ApiResponse<Restaurant>>(`${this.apiUrl}/owner/my-restaurant/toggle-open`, {});
  }
}
