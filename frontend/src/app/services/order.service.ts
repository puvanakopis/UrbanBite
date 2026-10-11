import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.models';
import { Address, Order, OrderStatus, Review } from '../models/order.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  public createOrder(payload: any): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, payload);
  }

  public getMyOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}/my-orders`);
  }

  public getRestaurantOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}/restaurant-orders`);
  }

  public getOrderById(id: number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${id}`);
  }

  public getOrderByNumber(orderNumber: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/number/${orderNumber}`);
  }

  public updateRestaurantOrderStatus(id: number, status: OrderStatus, note?: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${id}/status`, { status, note });
  }

  public rejectOrder(id: number, reason: string): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  public cancelOrder(id: number, reason?: string): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  // Address operations
  public getAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>('http://localhost:8080/api/addresses');
  }

  public addAddress(address: Address): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>('http://localhost:8080/api/addresses', address);
  }

  public deleteAddress(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`http://localhost:8080/api/addresses/${id}`);
  }

  // Reviews operations
  public getReviewsForRestaurant(restaurantId: number): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`http://localhost:8080/api/reviews/restaurant/${restaurantId}`);
  }

  public submitReview(orderId: number, rating: number, comment: string): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>('http://localhost:8080/api/reviews', { orderId, rating, comment });
  }
}
