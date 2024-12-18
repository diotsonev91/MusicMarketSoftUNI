import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { UserData } from './user-data.model';
import { UserStoreService } from '../core/user-store.service';
import { AdService } from '../ads/ad.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private userStore: UserStoreService,
    private adService: AdService
  ) {}

  /**
   * update the userStore.
   */
  setCurrentUserInUserStore(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const storedUser = localStorage.getItem('currentUser');
      console.log('STored user in local store: ', storedUser);
      if (storedUser) {
        try {
          // Parse the JSON string into an object
          const currentUser: UserData = JSON.parse(storedUser);
          // Optionally validate the object here
          this.userStore.setCurrentUser(currentUser);
        } catch (error) {
          console.error(
            'Failed to parse currentUser from localStorage:',
            error
          );
          this.userStore.setCurrentUser(null); // Fallback to null in case of error
        }
      } else {
        this.userStore.setCurrentUser(null); // No user found in localStorage
      }
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
  getCurrentUserIdAsync(): Observable<string | null> {
    return this.userStore.currentUser$.pipe(map((user) => user?._id || null));
  }
  getCurrentUserId(): string | null {
    return this.userStore.getCurrentUserId();
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
    return this.http
      .post(`/auth/register`, userData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update the profile of the logged-in user.
   */
  updateLoggedUserProfile(updates: Partial<UserData>): Observable<UserData> {
    const userId = this.userStore.getCurrentUserId(); // Use the non-async method to get the user ID synchronously.

    if (!userId) {
      throw new Error('No logged-in user to update.');
    }

    console.log('updated user data:', updates);

    // Proceed with the HTTP request to update the user
    return this.http.put<UserData>(`/users/edit-user/${userId}`, updates).pipe(
      catchError(this.handleError), // Handle errors gracefully
      switchMap(() =>
        // Fetch the updated profile after updating the user
        this.getUserProfile(userId).pipe(
          tap((updatedUser) => {
            console.log('UPDATED USER:', updatedUser);
            this.userStore.setCurrentUser(updatedUser); // Update the user in the store
          })
        )
      )
    );
  }

  /**
   * Delete the logged-in user.
   */
  deleteLoggedUser(userId: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`/users/delete-user/${userId}`)
      .pipe(
        tap(() => {
          console.log('User deleted successfully.');
          // No need to clear state explicitly here; logout will handle it
        }),
        catchError((error) => {
          console.error('Failed to delete user:', error);
          return throwError(() => error); // Propagate the error for further handling
        })
      );
  }

  /**
   * Handle HTTP errors.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('UserService error', error);
    return throwError(() => error.error?.message || 'An error occurred');
  }

  public clearUser() {
    this.userStore.clearCurrentUser();
  }
}
