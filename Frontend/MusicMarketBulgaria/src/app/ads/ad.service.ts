import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { AdData } from './ad-data.model';
import { Router } from '@angular/router';
import { UserData } from '../user/user-data.model';
import { UserStoreService } from '../core/user-store.service';

@Injectable({
  providedIn: 'root',
})
export class AdService {
  
  private userId: string | null = ""
  constructor(private http: HttpClient, private router: Router,private userStore: UserStoreService) {
     // Subscribe to the userStore to get the user ID reactively
     userStore.currentUser$.subscribe((user) => {
    this.userId = user?.id || null;
    });
  }
    
  
 
    /**
   * Fetch a user profile by ID.
   */
    getUserProfile(user: string): Observable<UserData> {
      return this.http
        .get<UserData>(`/users/username/${user}`)
       // .pipe(catchError(this.handleError));
    }
  

 //get ads for user
  getUserAds(userId: string): Observable<AdData[]> {
    
    return this.http.get<AdData[]>(`/ads/user/${userId}/ads`).pipe(
      catchError((error) => {
        console.error('Error fetching user ads:', error);
        return throwError(() => error);
      })
    );
  }

// Get ads for the logged-in user (reactively wait for userId)
getLoggedUserAds(): Observable<AdData[]> {
  return this.userStore.currentUser$.pipe(
    filter((user) => !!user?.id), // Wait until a valid user with ID is available
    switchMap((user) => {
      const userId = user?.id!;
      console.log("user id inside ad service: ",userId)
      return this.http.get<AdData[]>(`/ads/user/${userId}/ads`);
    }),
    catchError((error) => {
      console.error('Error fetching user ads:', error);
      return throwError(() => error);
    })
  );
}
  // Create a new ad for the logged-in user
  createAd(adData: Partial<AdData>, images: File[]): Observable<AdData> {
   
    console.log(this.userId)
    const formData = new FormData();
    formData.append('title', adData.title || '');
    formData.append('description', adData.description || '');
    formData.append('price', adData.price?.toString() || '');
    formData.append('deliveryType', adData.deliveryType || '');
    formData.append('condition', adData.condition || '');
    formData.append('category', adData.category || '');
    formData.append('subCategory', adData.subCategory || 'други');
    formData.append('location', adData.location || "");
   

    images.forEach((image) => formData.append('images', image, image.name));

    return this.http.post<AdData>(`/ads/`, formData).pipe(
      catchError((error) => {
        console.error('Error creating ad:', error);
        return throwError(() => error);
      })
    );
  }

// Edit an ad by ID
editAd(adId: string, updates: Partial<AdData>, images: File[], remainingImages: string[]): Observable<AdData> {
  

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

  return this.http.put<AdData>(`/ads/${adId}`, formData).pipe(
    catchError((error) => {
      console.error(`Error updating ad with ID ${adId}:`, error);
      return throwError(() => error);
    })
  );
}

  // Delete an ad by ID
  deleteAd(adId: string): Observable<{ message: string }> {
   
    return this.http.delete<{ message: string }>(`/ads/${adId}`).pipe(
      catchError((error) => {
        console.error(`Error deleting ad with ID ${adId}:`, error);
        return throwError(() => error);
      })
    );
  }

   // Get Ad by ID(public)
   getAdById(id: string): Observable<AdData> {
    return this.http.get<AdData>(`/ads/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching ad by ID: ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  searchAds(query: string): Observable<AdData[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<AdData[]>(`/ads/search`, { params }).pipe(
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

  return this.http.get<{ data: AdData[], currentPage: number, totalPages: number, totalAds: number }>(`/ads`, { params }).pipe(
    catchError((error) => {
      console.error('Error fetching all ads with pagination:', error);
      return throwError(() => error);
    })
  );
}

addRating(adId: string, userVote: number): Observable<number> {
  const payload = { userVote }; // Send user vote as -1, 0, or 1
  return this.http.post<number>(`/ads/${adId}/rating`, payload);
}

  // Get ads by category and subcategory
  getAdsByCategoryAndSubcategory(category: string, subCategory?: string): Observable<AdData[]> {
    const url = subCategory
      ? `/ads/category/${category}/${subCategory}`
      : `/ads/category/${category}`;
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
    return this.http.get<AdData[]>(`/ads/price-range`, { params }).pipe(
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
    const url = `/ads/category/${category}/${subCategory}`;
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
  const url = `/ads/category/${category}/price-range`;
  return this.http.get<AdData[]>(url, { params }).pipe(
    catchError((error) => {
      console.error(`Error fetching ads by category and price range:`, error);
      return throwError(() => error);
    })
  );
}
// Centralized method to navigate to the user's page
goToUser(userId: string): void {
  this.router.navigate([`/user`, userId]);
}

}


