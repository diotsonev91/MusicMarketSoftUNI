import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('No user is currently logged in.'));
    }
    return this.http.get<UserData>(`${this.baseUrl}/id/${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching logged user profile:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetch a user profile by ID.
   */
  getUserProfile(userId: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.baseUrl}/${userId}`).pipe(
      catchError((error) => {
        console.error(`Error fetching user profile for ID: ${userId}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update the profile of the logged-in user.
   */
  updateLoggedUserProfile(updates: Partial<UserData>): Observable<UserData> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('No user is currently logged in.'));
    }
    return this.http.put<UserData>(`${this.baseUrl}/${userId}`, updates).pipe(
      catchError((error) => {
        console.error('Error updating logged user profile:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete the logged-in user.
   */
  deleteLoggedUser(): Observable<{ message: string }> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('No user is currently logged in.'));
    }
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${userId}`).pipe(
      catchError((error) => {
        console.error('Error deleting user account:', error);
        return throwError(() => error);
      })
    );
  }
}
