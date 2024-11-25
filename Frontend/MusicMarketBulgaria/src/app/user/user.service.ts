import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UserData } from './user-data.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:5000/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Fetch the profile of the logged-in user.
   */
  getLoggedUserProfile(): Observable<UserData> {
    return this.http
      .get<UserData>(`${this.baseUrl}/id/${this.getCurrentUserId()}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetch a user profile by ID.
   */
  getUserProfile(userId: string): Observable<UserData> {
    return this.http
      .get<UserData>(`${this.baseUrl}/${userId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update the profile of the logged-in user.
   */
  updateLoggedUserProfile(updates: Partial<UserData>): Observable<UserData> {
    return this.http
      .put<UserData>(`${this.baseUrl}/edit-user/${this.getCurrentUserId()}`, updates, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete the logged-in user.
   */
  deleteLoggedUser(): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/delete-user/${this.getCurrentUserId()}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Helper: Get headers with the authorization token.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    if (!token) {
      throw new Error('Authentication token is missing.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Handle HTTP errors.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('UserService error', error);
    return throwError(() => error.error?.message || 'An error occurred');
  }

   /**
   * Extract the user ID from the JWT.
   */
   getCurrentUserId(): string | null {
    const token = this.authService.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id || null; // Extract 'id' from the JWT payload
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
}


