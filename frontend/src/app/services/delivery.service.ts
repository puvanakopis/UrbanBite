import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.models';
import { DeliveryAssignment, EarningsSummary } from '../models/delivery.models';
import { Order } from '../models/order.models';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private readonly apiUrl = 'http://localhost:8080/api/delivery';

  constructor(private http: HttpClient) {}

  public getTasks(): Observable<ApiResponse<DeliveryAssignment[]>> {
    return this.http.get<ApiResponse<DeliveryAssignment[]>>(`${this.apiUrl}/tasks`);
  }

  public getAvailableOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}/available-orders`);
  }

  public claimTask(orderId: number): Observable<ApiResponse<DeliveryAssignment>> {
    return this.http.post<ApiResponse<DeliveryAssignment>>(`${this.apiUrl}/claim/${orderId}`, {});
  }

  public updateStep(taskId: number, status: string, notes?: string): Observable<ApiResponse<DeliveryAssignment>> {
    return this.http.patch<ApiResponse<DeliveryAssignment>>(`${this.apiUrl}/tasks/${taskId}/step`, { status, notes });
  }

  public getEarnings(): Observable<ApiResponse<EarningsSummary>> {
    return this.http.get<ApiResponse<EarningsSummary>>(`${this.apiUrl}/earnings`);
  }
}
