import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdData } from './ad-data.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdService {
  private baseUrl = 'http://localhost:5000/ads';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch all ads for the logged-in user
  getLoggedUserAds(): Observable<AdData[]> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('No user is currently logged in.'));
    }
    return this.http.get<AdData[]>(`${this.baseUrl}/user/${userId}/ads`).pipe(
      catchError((error) => {
        console.error('Error fetching user ads:', error);
        return throwError(() => error);
      })
    );
  }

  // Create a new ad for the logged-in user
  createAd(adData: Partial<AdData>): Observable<AdData> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('No user is currently logged in.'));
    }
    return this.http.post<AdData>(`${this.baseUrl}/user/${userId}`, adData).pipe(
      catchError((error) => {
        console.error('Error creating ad:', error);
        return throwError(() => error);
      })
    );
  }

  // Edit an ad by ID
  editAd(adId: string, updates: Partial<AdData>): Observable<AdData> {
    return this.http.put<AdData>(`${this.baseUrl}/${adId}`, updates).pipe(
      catchError((error) => {
        console.error(`Error updating ad with ID ${adId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Delete an ad by ID
  deleteAd(adId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${adId}`).pipe(
      catchError((error) => {
        console.error(`Error deleting ad with ID ${adId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Get ad by ID
  getAdById(adId: string): Observable<AdData> {
    return this.http.get<AdData>(`${this.baseUrl}/${adId}`).pipe(
      catchError((error) => {
        console.error(`Error fetching ad with ID ${adId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Get all ads (Public)
  getAllAds(): Observable<AdData[]> {
    return this.http.get<AdData[]>(`${this.baseUrl}`).pipe(
      catchError((error) => {
        console.error('Error fetching all ads:', error);
        return throwError(() => error);
      })
    );
  }

  // Get ads by category and subcategory
  getAdsByCategoryAndSubcategory(category: string, subCategory?: string): Observable<AdData[]> {
    const url = subCategory
      ? `${this.baseUrl}/category/${category}/${subCategory}`
      : `${this.baseUrl}/category/${category}`;
    return this.http.get<AdData[]>(url).pipe(
      catchError((error) => {
        console.error(`Error fetching ads by category: ${category}`, error);
        return throwError(() => error);
      })
    );
  }

  // Get ads by price range
  getAdsByPriceRange(minPrice: number, maxPrice: number): Observable<AdData[]> {
    const params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString());
    return this.http.get<AdData[]>(`${this.baseUrl}/price-range`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching ads by price range:', error);
        return throwError(() => error);
      })
    );
  }

  // Get ads by category, subcategory, and price range
  getAdsByCategorySubcategoryPriceRange(
    category: string,
    subCategory: string,
    minPrice: number,
    maxPrice: number
  ): Observable<AdData[]> {
    const params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString());
    const url = `${this.baseUrl}/category/${category}/${subCategory}`;
    return this.http.get<AdData[]>(url, { params }).pipe(
      catchError((error) => {
        console.error(`Error fetching ads by category, subcategory, and price range`, error);
        return throwError(() => error);
      })
    );
  }
}
