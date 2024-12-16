import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  private apiUrl = environment.apiUrl; // Base API URL

  private isRefreshing = false; // Tracks if a refresh token request is in progress
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiRequest = request;
  
    // Exclude blob URLs
    if (request.url.startsWith('blob:')) {
      console.log('Skipping interceptor for blob URL:', request.url);
      return next.handle(request); // Skip modification for blob URLs
    }
  
    // Attach API Base URL if the request URL is relative
    if (!request.url.startsWith('http')) {
      apiRequest = request.clone({
        url: `${this.apiUrl}${request.url}`,
      });
    }
  
    // Attach Authorization Header if Token Exists
    const token = this.authService.getAccessToken();
    if (token) {
      apiRequest = this.addTokenToRequest(apiRequest, token);
    }
  
    // Handle the HTTP Request
    return next.handle(apiRequest).pipe(
      catchError((error) => {
        // If the error is 401, attempt token refresh
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(apiRequest, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // Call the refresh token endpoint
      return this.authService.refreshAccessToken().pipe(
        switchMap((newToken: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newToken);

          // Retry the failed request with the new token
          return next.handle(this.addTokenToRequest(request, newToken));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout(); // Log out if refresh fails
          return throwError(() => error);
        })
      );
    } else {
      // Wait until the refresh token process is complete
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenToRequest(request, token as string)))
      );
    }
  }
}
