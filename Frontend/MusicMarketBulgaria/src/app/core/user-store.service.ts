import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData } from '../user/user-data.model';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private currentUser$$ = new BehaviorSubject<UserData | null>(null);
  public currentUser$: Observable<UserData | null> = this.currentUser$$.asObservable();

  constructor() {
    // Attempt to load user from localStorage on service initialization
    const storedUser = this.getUserFromLocalStorage();
    if (storedUser) {
      this.currentUser$$.next(storedUser);
    }
  }

  // Get the latest current user, fallback to localStorage if BehaviorSubject is null
  getCurrentUser(): UserData | null {
    const currentUser = this.currentUser$$.value;
    if (currentUser) {
      return currentUser;
    }

    // Fallback to localStorage
    const storedUser = this.getUserFromLocalStorage();
    if (storedUser) {
      this.currentUser$$.next(storedUser); // Update BehaviorSubject for future use
    }
    return storedUser;
  }

// Set the current user in the BehaviorSubject without storing in localStorage
setCurrentUser(user: UserData | null): void {
  const clonedUser = user ? { ...user } : null;

  this.currentUser$$.next(clonedUser);
  console.log("USER stored in subject: ", clonedUser);
}

  // Clear the user state (e.g., on logout)
  clearCurrentUser(): void {
    localStorage.removeItem('currentUser'); // Remove from localStorage
    this.currentUser$$.next(null);
  }

  // Private helper: Retrieve the user from localStorage
  private getUserFromLocalStorage(): UserData | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

getCurrentUserId(){
  const currentUser = this.currentUser$$.value;
  return currentUser?._id;
}  
}
