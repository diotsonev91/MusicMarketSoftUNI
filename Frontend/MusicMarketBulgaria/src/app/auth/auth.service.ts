// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { UserCredentials } from './user-credentials.model';
import { UserData } from '../user/user-data.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private accessTokenSubject = new BehaviorSubject<string | null>(this.getAccessToken());

  constructor(private http: HttpClient) {}

  login(credentials: UserCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        this.setAccessToken(response.accessToken);
      }),
      catchError(this.handleError)
    );
  }

  register(userData: UserData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearAccessToken();
    this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe();
  }

  refreshAccessToken(): Observable<string | null> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh-token`, {}, { withCredentials: true }).pipe(
      tap((response) => this.setAccessToken(response.accessToken)),
      map((response) => response.accessToken),
      catchError(this.handleError)
    );
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  private setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
    this.accessTokenSubject.next(token);
  }

  private clearAccessToken() {
    localStorage.removeItem('accessToken');
    this.accessTokenSubject.next(null);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private isTokenExpired(token: string): boolean {
    const expiry = this.getTokenExpiration(token);
    return expiry ? Date.now() >= expiry : true;
  }

  private getTokenExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('AuthService error', error);
    return throwError(() => error);
  }
}
