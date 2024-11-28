import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserData } from './user-data.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
 

  private user$$ = new BehaviorSubject<UserData| null>(null);
  private user$ = this.user$$.asObservable();


  constructor(private http: HttpClient) {}

  /**
   * Fetch the profile of the logged-in user.
   */
  getLoggedUserProfile(): Observable<UserData> {
    return this.http
      .get<UserData>(`/users/me`)
      .pipe(catchError(this.handleError));
  }

  register(userData: UserData): Observable<any> {
    return this.http.post(`/auth/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Fetch a user profile by ID.
   */
  getUserProfile(userId: string): Observable<UserData> {
    return this.http
      .get<UserData>(`/users/${userId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update the profile of the logged-in user.
   */
  updateLoggedUserProfile(updates: Partial<UserData>): Observable<UserData> {
    return this.http
      .put<UserData>(`/users/edit-user/${this.getCurrentUserId()}`, updates)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete the logged-in user.
   */
  deleteLoggedUser(): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`/users/delete-user/${this.getCurrentUserId()}`)
      .pipe(catchError(this.handleError));
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
    const currentUser = this.user$$.value; // Access the latest value of the BehaviorSubject
    console.log(currentUser)
    return currentUser ? currentUser.id : null; // Return the ID if the user exists, otherwise null
  }
  setUser(user: UserData | null): void {
    this.user$$.next(user); // Push the new user data into the BehaviorSubject
  }
}


