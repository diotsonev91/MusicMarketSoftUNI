import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AdData } from './ad-data.model';
import { AuthService } from '../auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from '../user/user.service';


@Injectable({
  providedIn: 'root',
})
export class AdService {
  private baseUrl = 'http://localhost:5000/ads';

  constructor(private http: HttpClient, private authService: AuthService, private userService: UserService) {}

 
   // Private method to prepare headers and check user authentication
   private getAuthorizedHeaders(): { headers: HttpHeaders, userId: string } {
    const userId = this.userService.getCurrentUserId();
    const token = this.authService.getAccessToken();

    if (!userId || !token) {
      throw new Error('No user is currently logged in or token is missing.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return { headers, userId };
  }

   // Fetch all ads for the logged-in user
   getLoggedUserAds(): Observable<AdData[]> {
    const { userId } = this.getAuthorizedHeaders();
    return this.http.get<AdData[]>(`${this.baseUrl}/user/${userId}/ads`).pipe(
      catchError((error) => {
        console.error('Error fetching user ads:', error);
        return throwError(() => error);
      })
    );
  }

  //public get ads for user
  getUserAds(userId: string): Observable<AdData[]> {
    
    return this.http.get<AdData[]>(`${this.baseUrl}/user/${userId}/ads`).pipe(
      catchError((error) => {
        console.error('Error fetching user ads:', error);
        return throwError(() => error);
      })
    );
  }

  // Create a new ad for the logged-in user
  createAd(adData: Partial<AdData>, images: File[]): Observable<AdData> {
    const { headers, userId } = this.getAuthorizedHeaders();

    const formData = new FormData();
    formData.append('title', adData.title || '');
    formData.append('description', adData.description || '');
    formData.append('price', adData.price?.toString() || '');
    formData.append('deliveryType', adData.deliveryType || '');
    formData.append('condition', adData.condition || '');
    formData.append('category', adData.category || '');
    formData.append('subCategory', adData.subCategory || 'други');
    formData.append('userId', userId);

    images.forEach((image) => formData.append('images', image, image.name));

    return this.http.post<AdData>(`${this.baseUrl}`, formData, { headers }).pipe(
      catchError((error) => {
        console.error('Error creating ad:', error);
        return throwError(() => error);
      })
    );
  }

// Edit an ad by ID
editAd(adId: string, updates: Partial<AdData>, images: File[], remainingImages: string[]): Observable<AdData> {
  const { headers } = this.getAuthorizedHeaders();

  const formData = new FormData();

  // Add text fields if provided
  if (updates.title) formData.append('title', updates.title);
  if (updates.description) formData.append('description', updates.description);
  if (updates.price) formData.append('price', updates.price.toString());
  if (updates.deliveryType) formData.append('deliveryType', updates.deliveryType);
  if (updates.condition) formData.append('condition', updates.condition);
  if (updates.category) formData.append('category', updates.category);
  if (updates.subCategory) formData.append('subCategory', updates.subCategory);

  // Add new images to the FormData
  images.forEach((image) => formData.append('images', image, image.name));

  // Add remaining images (JSON string)
  formData.append('remainingImages', JSON.stringify(remainingImages));

  console.log('FormData contents:', {
    updates,
    images,
    remainingImages,
  });

  return this.http.put<AdData>(`${this.baseUrl}/${adId}`, formData, { headers }).pipe(
    catchError((error) => {
      console.error(`Error updating ad with ID ${adId}:`, error);
      return throwError(() => error);
    })
  );
}

  // Delete an ad by ID
  deleteAd(adId: string): Observable<{ message: string }> {
    const { headers } = this.getAuthorizedHeaders();
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${adId}`, { headers }).pipe(
      catchError((error) => {
        console.error(`Error deleting ad with ID ${adId}:`, error);
        return throwError(() => error);
      })
    );
  }

   // Get Ad by ID(public)
   getAdById(id: string): Observable<AdData> {
    return this.http.get<AdData>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching ad by ID: ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  searchAds(query: string): Observable<AdData[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<AdData[]>(`${this.baseUrl}/search`, { params }).pipe(
      catchError((error) => {
        console.error('Error searching ads:', error);
        return throwError(() => error);
      })
    );
  }
  

  // Get all ads (Public) with Pagination
getAllAds(page: number = 1, pageSize: number = 20): Observable<{ data: AdData[], currentPage: number, totalPages: number, totalAds: number }> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  return this.http.get<{ data: AdData[], currentPage: number, totalPages: number, totalAds: number }>(`${this.baseUrl}`, { params }).pipe(
    catchError((error) => {
      console.error('Error fetching all ads with pagination:', error);
      return throwError(() => error);
    })
  );
}

addRating(adId: string, userVote: number): Observable<number> {
  const payload = { userVote }; // Send user vote as -1, 0, or 1
  return this.http.post<number>(`${this.baseUrl}/${adId}/rating`, payload);
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
  // Get ads by category and price range
getAdsByCategoryAndPriceRange(
  category: string,
  minPrice: number,
  maxPrice: number
): Observable<AdData[]> {
  const params = new HttpParams()
    .set('minPrice', minPrice.toString())
    .set('maxPrice', maxPrice.toString());
  const url = `${this.baseUrl}/category/${category}/price-range`;
  return this.http.get<AdData[]>(url, { params }).pipe(
    catchError((error) => {
      console.error(`Error fetching ads by category and price range:`, error);
      return throwError(() => error);
    })
  );
}
}


