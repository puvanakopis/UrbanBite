import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse, AuthResponse, Role, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'urbanbite_token';
  private readonly USER_KEY = 'urbanbite_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public hasRole(role: Role): boolean {
    return this.currentUserValue?.role === role;
  }

  public get isDeliveryPartner(): boolean {
    return this.currentUserValue?.role === 'ROLE_DELIVERY_PARTNER';
  }

  public get isRestaurantOwner(): boolean {
    return this.currentUserValue?.role === 'ROLE_RESTAURANT_OWNER';
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === 'ROLE_ADMIN';
  }

  public get isCustomer(): boolean {
    return this.currentUserValue?.role === 'ROLE_CUSTOMER';
  }

  public register(payload: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/register`, payload);
  }

  public verifyOtp(payload: { email: string; otp: string; challengeType?: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/verify-otp`, payload).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  public resendOtp(payload: { email: string; challengeType?: string }): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/resend-otp`, payload);
  }

  public login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  public forgotPassword(email: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/forgot-password`, { email });
  }

  public resetPassword(payload: { email: string; otp: string; newPassword: string }): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/reset-password`, payload);
  }

  public fetchCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`).pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.data));
          this.currentUserSubject.next(res.data);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  public setSession(authData: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authData.token);
    const user: User = {
      id: authData.userId,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role,
      isVerified: authData.isVerified,
      isActive: true,
      restaurantId: authData.restaurantId
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public updateLocalProfile(updatedFields: Partial<User>): void {
    const current = this.currentUserValue;
    if (!current) return;
    const updated = { ...current, ...updatedFields };
    localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
    this.currentUserSubject.next(updated);
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
