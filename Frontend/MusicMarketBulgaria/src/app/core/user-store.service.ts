import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { UserData } from '../user/user-data.model';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private currentUser$$ = new BehaviorSubject<UserData | null>(null);
  private currentUserId$$ = new BehaviorSubject<string | null>(null);

  public currentUser$: Observable<UserData | null> = this.currentUser$$
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );

  public currentUserId$: Observable<string | null> = this.currentUserId$$
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor() {
    // Load the user from localStorage on initialization
    const storedUser = this.getUserFromLocalStorage();

    if (storedUser) {
      this.currentUser$$.next(storedUser);
      this.currentUserId$$.next(storedUser._id || null); // Extract user ID from stored user object
    }
  }

  // Get the current user (synchronous)
  getCurrentUser(): UserData | null {
    const currentUser = this.currentUser$$.value;
    if (currentUser) {
      return currentUser;
    }

    const storedUser = this.getUserFromLocalStorage();
    if (storedUser) {
      this.currentUser$$.next(storedUser);
      this.currentUserId$$.next(storedUser._id || null);
    }
    return storedUser;
  }

  // Set the current user (updates both user and user ID)
  setCurrentUser(user: UserData | null): void {
    const clonedUser = user ? { ...user } : null;
    const currentValue = this.currentUser$$.value;

    if (JSON.stringify(clonedUser) !== JSON.stringify(currentValue)) {
      this.currentUser$$.next(clonedUser);
      localStorage.setItem('currentUser', JSON.stringify(clonedUser));
      console.log('USER stored in subject: ', clonedUser);

      const userId = clonedUser?._id || null;
      this.currentUserId$$.next(userId);
    }
  }

  // Clear the user state (e.g., on logout)
  clearCurrentUser(): void {
    localStorage.removeItem('currentUser');
    this.currentUser$$.next(null);
    this.currentUserId$$.next(null);
  }

  // Get the current user ID (synchronous)
  getCurrentUserId(): string | null {
    const userId = this.currentUserId$$.value;
    if (userId) {
      return userId;
    }

    const storedUser = this.getUserFromLocalStorage();
    const storedUserId = storedUser?._id || null;
    if (storedUserId) {
      this.currentUserId$$.next(storedUserId); // Update BehaviorSubject for future use
    }
    return storedUserId;
  }

  // Get the current user ID (asynchronous)
  getCurrentUserIdAsync(): Observable<string | null> {
    return this.currentUserId$;
  }

  // Private helper: Retrieve the user from localStorage
  private getUserFromLocalStorage(): UserData | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }
}
