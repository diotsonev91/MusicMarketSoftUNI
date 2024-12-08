import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { UserCredentials } from '../user/user-credentials.model';
import { UserData } from '../user/user-data.model';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: UserCredentials): Observable<{ accessToken: string; currentUser: UserData }> {
    return this.http.post<{ accessToken: string; currentUser: UserData }>(`/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(response.currentUser));
        //console.log("Once user is set: ", response.currentUser )
      })
    );
  }


  logout(): Observable<void> {
    return this.http.post<void>('/auth/logout', {}).pipe(
      tap(() => {
        // Clear the token and user state upon successful API response
        this.clearAccessToken();

      })
    );
  }


  private clearAccessToken(): void {
    localStorage.removeItem('accessToken');
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken(); // Use the existing getAccessToken method
    return !!token; // Returns true if the token exists, false otherwise
  }

  refreshAccessToken(): Observable<string> {
    return this.http.post<{ accessToken: string }>(`/auth/refresh-token`, {}).pipe(
      map((response) => response.accessToken), // Extract accessToken from the response
      catchError((error) => {
        const errorMessage =
          error.status === 403
            ? 'Invalid or expired refresh token'
            : 'Error refreshing token';
        return throwError(() => errorMessage);
      })
    );
  }

  // Token Management
  public setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
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
