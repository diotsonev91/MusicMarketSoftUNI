import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserCredentials } from '../user/user-credentials.model';
import { UserService } from '../user/user.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private userService: UserService) {}

  // Login
   // Login
   login(credentials: UserCredentials): Observable<{ accessToken: string; user: any }> {
    return this.http.post<{ accessToken: string; user: any }>(`/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken); // Store the token
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/auth/logout', {}).pipe(
      tap(() => {
        // Clear the token and user state upon successful API response
        this.clearAccessToken();
        this.userService.setUser(null);
      })
    );
  }

  // Refresh Access Token
  refreshAccessToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`/auth/refresh-token`, {}, { withCredentials: true }).pipe(
      tap((response) => this.setAccessToken(response.accessToken)),
      catchError(this.handleError)
    );
  }

  // Token Management
  public setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  private clearAccessToken(): void {
    localStorage.removeItem('accessToken');
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Handle HTTP Errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('AuthService error:', error);
    return throwError(() => error);
  }
}
