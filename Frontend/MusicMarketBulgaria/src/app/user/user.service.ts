import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserData } from './user-data.model';
import { UserStoreService } from '../core/user-store.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient,private userStore: UserStoreService) {}

  /**
   * Load the current user from the API and update the userStore.
   */
  loadCurrentUser(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.http.get<UserData>('/users/me').subscribe(
        (user) => {
          this.userStore.setCurrentUser(user); // Update userStore
          console.log("after setting user in userStore/userService: ", this.userStore.getCurrentUser())
        },
        (error) => {
          console.error('Failed to load current user:', error);
          this.userStore.clearCurrentUser(); // Clear userStore on error
        }
      );
    }
  }

  /**
   * Get the current user as an observable for reactive components.
   */
  getCurrentUser$(): Observable<UserData | null> {
    return this.userStore.currentUser$;
  }

  /**
   * Get the current user's data directly.
   */
  getCurrentUserData(): UserData | null {
    return this.userStore.getCurrentUser();
  }

  /**
   * Get the current user's ID.
   */
  getCurrentUserId(): string | null {
    const currentUser = this.userStore.getCurrentUser();
    return currentUser ? currentUser.id : null;
  }

  /**
   * Fetch a user profile by user ID.
   */
  getUserProfile(userId: string): Observable<UserData> {
    return this.http
      .get<UserData>(`/users/id/${userId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Register a new user.
   */
  register(userData: UserData): Observable<any> {
    return this.http.post(`/auth/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update the profile of the logged-in user.
   */
  updateLoggedUserProfile(updates: Partial<UserData>): Observable<UserData> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No logged-in user to update.');
    }

    return this.http
      .put<UserData>(`/users/edit-user/${userId}`, updates)
      .pipe(
        catchError(this.handleError),
        // Update this.userStore after a successful update
        tap((updatedUser) => this.userStore.setCurrentUser(updatedUser))
      );
  }

  /**
   * Delete the logged-in user.
   */
  deleteLoggedUser(): Observable<{ message: string }> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('No logged-in user to delete.');
    }

    return this.http
      .delete<{ message: string }>(`/users/delete-user/${userId}`)
      .pipe(
        catchError(this.handleError),
        // Clear this.userStore after deletion
        tap(() => this.userStore.clearCurrentUser())
      );
  }

  /**
   * Handle HTTP errors.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('UserService error', error);
    return throwError(() => error.error?.message || 'An error occurred');
  }

  public clearUser(){
    this.userStore.clearCurrentUser();
  }
}
