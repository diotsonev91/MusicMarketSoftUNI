import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  private apiUrl = environment.apiUrl; // Base API URL

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiRequest = request;

    // Check if the request URL is relative (not absolute)
    if (!request.url.startsWith('http')) {
      // Prepend the API base URL
      apiRequest = request.clone({
        url: `${this.apiUrl}${request.url}`,
      });
    }

    // Retrieve the token from AuthService
    const token = this.authService.getAccessToken();
    if (token) {
      // Clone the request and add the Authorization header
      apiRequest = apiRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

   // Handle response to replace token if a new one is sent
   return next.handle(apiRequest).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const newToken = event.headers.get('Authorization');
        if (newToken) {
          this.authService.setAccessToken(newToken.replace('Bearer ', ''));
        }
      }
    })
  );
  }
}
