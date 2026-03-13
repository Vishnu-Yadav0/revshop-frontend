import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { signal, computed } from '@angular/core';

export interface UserAuth {
  token: string | null;
  role: string | null;
  userId: string | null;
  name: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  // Reactive authentication state
  authState = signal<UserAuth>({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    userId: localStorage.getItem('userId'),
    name: localStorage.getItem('name')
  });

  // Derived reactive states
  isLoggedIn = computed(() => !!this.authState().token);
  userRole = computed(() => this.authState().role);

  constructor(private http: HttpClient) { }

  registerBuyer(buyerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/buyer`, buyerData);
  }

  registerSeller(sellerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/seller`, sellerData);
  }

  loginBuyer(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  loginSeller(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  reactivate(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reactivate`, credentials);
  }

  // ==== Authentication Helper Methods ====

  /**
   * Saves authentication data to localStorage
   */
  saveAuthData(token: string, role: string, userId: string, name: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', name);

    // Update signal
    this.authState.set({ token, role, userId, name });
  }

  /**
   * Clears authentication data and resets state
   */
  logout(): void {
    localStorage.clear();
    this.authState.set({ token: null, role: null, userId: null, name: null });
  }

  /**
 * Fetches the security question for a given email
 */
  getSecurityQuestion(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/security-question`, { params: { email } });
  }

  /**
   * Resets the password using security answer
   */
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  sendPasswordResetLink(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password/send-link`, { email });
  }

  resetPasswordViaLink(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password/reset-via-link`, data);
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/otp/send`, null, { params: { email } });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/otp/verify`, { email, otp });
  }


}
