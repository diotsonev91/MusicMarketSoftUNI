import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppInterceptor } from './auth/app.interceptor';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      // DI-based interceptors must be explicitly enabled.
      withInterceptorsFromDi(),
    ),
    {provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true},
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
