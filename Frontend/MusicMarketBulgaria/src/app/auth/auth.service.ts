import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
//SIMPLE IMPLEMENTATION FOR BASIC FUNCTIONALITY TEST ONLY
export class AuthService {
  private auth: Auth = inject(Auth);  // Injects the Auth service

  // Sign up a new user, returning an observable
  //TODO: User credentials should be inside a UserInterface
  signUp(email: string, password: string): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map((result) => {
        console.log('User registered successfully:', result.user);
        return;
      }),
      catchError((error) => {
        console.error('Error during sign up:', error);
        throw error;
      })
    );
  }

  // Sign in an existing user, returning an observable
  signIn(email: string, password: string): Observable<void> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(() => {
        console.log('User signed in successfully');
        return;
      }),
      catchError((error) => {
        console.error('Error during sign in:', error);
        throw error;
      })
    );
  }

}
