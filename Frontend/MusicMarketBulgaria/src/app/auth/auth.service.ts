// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { UserCredentials } from './user-credentials.model';
import { RegisterUserData } from './register-user-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  private apiUrl = environment.apiUrl;
  private accessTokenSubject = new BehaviorSubject<string | null>(this.getAccessToken());

  constructor(private http: HttpClient) {}

  // Login function that sets accessToken in localStorage
  login(credentials: UserCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('accessToken', response.accessToken);
        this.accessTokenSubject.next(response.accessToken);
      }),
      catchError(this.handleError)
    );
  }

  // Register function
  register(userData: RegisterUserData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(catchError(this.handleError));
  }

  // Function to get access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Refresh token function, which uses the refresh token from the HTTP-only cookie
  refreshAccessToken(): Observable<string | null> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh-token`, {}, { withCredentials: true }).pipe(
      tap((response) => {
        const accessToken = response.accessToken;
        localStorage.setItem('accessToken', accessToken);
        this.accessTokenSubject.next(accessToken);
      }),
      map(response => response.accessToken), // Map to just the accessToken string
      catchError(this.handleError)
    );
  }

  // Firebase chat token retrieval (requires access token to be valid)
  getFirebaseChatToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/chat-token`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
  }

  // Logout function
  logout(): void {
    localStorage.removeItem('accessToken');

    this.accessTokenSubject.next(null);
    this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe();
  }

  // Get authorization headers for authenticated requests
  private getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Method to check token and refresh if expired before making requests
  getAccessTokenWithRefresh(): Observable<string | null> {
    return this.accessTokenSubject.pipe(
      switchMap((token) => {
        if (token) {
          return this.accessTokenSubject;
        } else {
          return this.refreshAccessToken();
        }
      })
    );
  }

  // Error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    let customMessage = 'An error occurred';
  
    if (error.status === 400) {
      customMessage = 'Bad request - please check your input';
    } else if (error.status === 401) {
      customMessage = 'Unauthorized - please log in again';
    } else if (error.status === 403) {
      customMessage = 'Invalid or expired refresh token'; // Match expected error message here
    } else if (error.status === 500) {
      customMessage = 'Server error - please try again later';
    }
  
    console.error('AuthService error', error); // Keep the error log for debugging
    return throwError(customMessage); // Return the custom message for testing
  }
  
   // Method to check if the user is logged in
   isLoggedIn(): boolean {
    const token = this.getAccessToken();
    if (token) {
      // Optional: Check token expiration if token is a JWT
      const expiry = this.getTokenExpiration(token);
      if (expiry) {
        return Date.now() < expiry;
      }
      return true;
    }
    return false;
  }

  // Helper to get the access token's expiration time
  private getTokenExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
    } catch (error) {
      return null;
    }
  }
}
