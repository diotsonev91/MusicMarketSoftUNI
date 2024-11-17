import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable, throwError } from 'rxjs';
  import { catchError, switchMap } from 'rxjs/operators';
  import { AuthService } from './auth.service';
  
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Attach Authorization header if the access token exists
      const token = localStorage.getItem('accessToken');
      const clonedReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;
  
      return next.handle(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && req.url !== 'http://localhost:5000/auth/refresh-token') {
            // Token expired; attempt to refresh
            return this.authService.refreshAccessToken().pipe(
              switchMap((newToken: string | null) => {
                if (!newToken) {
                  this.authService.logout(); // Logout if refresh fails or returns null
                  return throwError(() => new Error('Unable to refresh access token.'));
                }
  
                // Retry the failed request with the new token
                const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
                return next.handle(retryReq);
              }),
              catchError((refreshError) => {
                this.authService.logout(); // Logout on refresh failure
                return throwError(() => refreshError);
              })
            );
          }
          return throwError(() => error);
        })
      );
    }
  }
  