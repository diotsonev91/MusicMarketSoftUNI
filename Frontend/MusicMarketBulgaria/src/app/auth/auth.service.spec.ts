import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { UserCredentials } from './user-credentials.model';
import { RegisterUserData } from './register-user-data.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockApiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should handle an error response on login', () => {
      const credentials: UserCredentials = { email: 'user@example.com', password: 'wrongpassword' };
  
      service.login(credentials).subscribe(
        () => fail('expected an error'),
        (error) => {
          expect(error).toBe('Bad request - please check your input'); // Match custom message
        }
      );
  
      const req = httpMock.expectOne(`${mockApiUrl}/auth/login`);
      req.flush({ error: "Invalid credentials" }, { status: 400, statusText: 'Bad Request' });
    });
  });
  

  describe('register', () => {
    it('should handle an error response on registration for duplicate email', () => {
      const userData: RegisterUserData = { username: 'johndoe', email: 'existing@example.com', password: 'password123' };
  
      service.register(userData).subscribe(
        () => fail('expected an error'),
        (error) => {
          expect(error).toBe('Bad request - please check your input'); // Match custom message
        }
      );
  
      const req = httpMock.expectOne(`${mockApiUrl}/auth/register`);
      req.flush({ error: "User with this email already exists" }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('refreshAccessToken', () => {
    it('should handle an error response when refresh token is invalid', () => {
      service.refreshAccessToken().subscribe(
        () => fail('expected an error'),
        (error) => {
          expect(error).toBe('Invalid or expired refresh token');  // Expect custom error message
        }
      );
  
      const req = httpMock.expectOne(`${mockApiUrl}/auth/refresh-token`);
      req.flush({}, { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('logout', () => {
    it('should clear the access token and notify logout', () => {
      localStorage.setItem('accessToken', 'existing-token');

      service.logout();

      expect(localStorage.getItem('accessToken')).toBeNull();

      const req = httpMock.expectOne(`${mockApiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: "Logged out successfully" });
    });
  });

  describe('handleError', () => {
    it('should handle HTTP errors', () => {
      const mockError = new HttpErrorResponse({
        error: 'Server error',
        status: 500,
        statusText: 'Internal Server Error'
      });
  
      service['handleError'](mockError).subscribe(
        () => fail('expected an error'),
        (error) => {
          expect(error).toBe('Server error - please try again later'); // Match custom message
        }
      );
    });
  });
});
