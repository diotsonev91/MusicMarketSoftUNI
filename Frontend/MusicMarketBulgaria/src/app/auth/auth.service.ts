import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from './../user/user.service';
import { User } from './../user/user.model';
import { UserCredentials } from './user-credentials.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth); 
  private userService = inject(UserService); 

  // Register new user with email, password, and additional profile data
  signUp(credentials: UserCredentials, userData: Omit<User, 'uid' | 'email'>): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(
      switchMap((result) => {
        console.log('User registered successfully:', result.user);

        // Combine Firebase user ID and email with the profile data
        const newUser: User = {
          uid: result.user.uid,
          email: result.user.email || '', 
          ...userData
        };

        // Create Firestore user profile document with the additional data
        return from(this.userService.createUserProfile(newUser.uid, newUser));
      }),
      map(() => {
        console.log('User profile created in Firestore');
        return;
      }),
      catchError((error) => {
        console.error('Error during sign up or Firestore profile creation:', error);
        throw error;
      })
    );
  }

  // Sign in existing user
  signIn(credentials: UserCredentials): Observable<UserCredential | null> {
    return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(
      map((userCredential: UserCredential) => {
        console.log('User signed in successfully:', userCredential);
        // Return the entire UserCredential object
        return userCredential;
      }),
      catchError((error) => {
        console.error('Error during sign in:', error);
        throw error;
      })
    );
  }

  // Logout method
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        console.log('User logged out');
        return;
      }),
      catchError((error) => {
        console.error('Error during logout:', error);
        throw error;
      })
    );
  }
}
