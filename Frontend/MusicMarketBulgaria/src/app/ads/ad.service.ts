import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { AdData } from './ad-data.model';
import { Router } from '@angular/router';
import { UserData } from '../user/user-data.model';
import { UserStoreService } from '../core/user-store.service';
import { RatingSubmitModel } from './ad-details/ad-rating/rating-models/rating-submit-model';
import { RatingDisplayModel } from './ad-details/ad-rating/rating-models/rating-display-model';
import { AdStateService } from './user-ads/ad-state.service';

@Injectable({
  providedIn: 'root',
})
export class AdService {
  private userId: string | null = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private userStore: UserStoreService,
    private adStateService: AdStateService
  ) {
    // Subscribe to the userStore to get the user ID reactively
    userStore.currentUser$.subscribe((user) => {
      this.userId = user?._id || null;
    });
  }

  private getUserId(): string | null {
    return this.userId;
  }

  /**
   * Fetch a user profile by ID.
   */
  getUserProfile(user: string): Observable<UserData> {
    return this.http.get<UserData>(`/users/username/${user}`);
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

  getLoggedUserAds(): Observable<AdData[]> {
    return this.userStore.currentUser$.pipe(
      tap((user) => console.log('Emitted user from userStore:', user)), // Debugging
      switchMap((user) => {
        if (!user?._id) {
          console.warn('User does not have a valid _id. Skipping API call.');
          return throwError(() => new Error('User does not have a valid ID.'));
        }

        const userId = user._id;
       // console.log('User ID for fetching ads:', userId);

        return this.http
          .get<AdData[]>(`/ads/user/${userId}/ads`)
          .pipe(tap((ads) => console.log('Fetched ads:', ads)));
      }),
      catchError((error) => {
        console.error('Error fetching logged-in user ads:', error);
        return throwError(() => error);
      })
    );
  }
  // Create a new ad for the logged-in user
  createAd(adData: Partial<AdData>, images: File[]): Observable<AdData> {
   // console.log(this.userId);
    const formData = new FormData();
    formData.append('title', adData.title || '');
    formData.append('description', adData.description || '');
    formData.append('price', adData.price?.toString() || '');
    formData.append('deliveryType', adData.deliveryType || '');
    formData.append('condition', adData.condition || '');
    formData.append('category', adData.category || '');
    formData.append('subCategory', adData.subCategory || 'други');
    formData.append('location', adData.location || '');

    images.forEach((image) => formData.append('images', image, image.name));

    return this.http.post<AdData>(`/ads/`, formData).pipe(
      tap((newAd) => {
       // console.log('Ad created successfully:', newAd);
        this.adStateService.updateAd(newAd); // Update the ad state with the new ad
      }),
      catchError((error) => {
        console.error('Error creating ad:', error);
        return throwError(() => error);
      })
    );
  }

  // Edit an ad by ID
  editAd(
    adId: string,
    updates: Partial<AdData>,
    images: File[],
    remainingImages: string[]
  ): Observable<AdData> {
    const formData = new FormData();
   // console.log('FORM DATA INSIDE EDIT AD ', updates);
    // Add text fields if provided
    if (updates.title) formData.append('title', updates.title);
    if (updates.description)
      formData.append('description', updates.description);
    if (updates.price) formData.append('price', updates.price.toString());
    if (updates.deliveryType)
      formData.append('deliveryType', updates.deliveryType);
    if (updates.condition) formData.append('condition', updates.condition);
    if (updates.category) formData.append('category', updates.category);
    if (updates.subCategory)
      formData.append('subCategory', updates.subCategory);
    if (updates.location) formData.append('location', updates.location);

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
      tap((updatedAd) => {
        // Update the ad in the AdStateService
        this.adStateService.updateAd(updatedAd);
       // console.log(`Ad with ID ${adId} successfully updated in memory.`);
      }),
      catchError((error) => {
        console.error(`Error updating ad with ID ${adId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Delete an ad by ID
  deleteAd(adId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/ads/${adId}`).pipe(
      tap(() => {
        // Only clear the ad from memory after a successful response
        this.adStateService.clearAd(adId);
       // console.log(`Ad with ID ${adId} successfully deleted from memory.`);
      }),
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

  getAllAds(
    page: number = 1,
    pageSize: number = 20
  ): Observable<{
    data: AdData[];
    currentPage: number;
    totalPages: number;
    totalAds: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http
      .get<{
        data: AdData[];
        currentPage: number;
        totalPages: number;
        totalAds: number;
      }>(`/ads`, { params })
      .pipe(
        tap((response) => {
         // console.log('Received response from backend:', response); // Log the full response
        }),
        catchError((error) => {
          console.error('Error fetching all ads with pagination:', error);
          return throwError(() => error);
        })
      );
  }

  // Fetch like and dislike counts for an ad
  getAdLikeDislikeCounts(
    adId: string
  ): Observable<{ likes: number; dislikes: number }> {
    return this.http.get<{ likes: number; dislikes: number }>(
      `/like-dislike/counts/${adId}`
    );
  }

  // Fetch user's current vote state for an ad
  getUserAdState(adId: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(
      `/like-dislike/state/${adId}/${this.getUserId()}`
    );
  }

  // Update user's like/dislike vote
  addLikeDislike(adId: string, userVote: number): Observable<any> {
    const action =
      userVote === 1 ? 'like' : userVote === -1 ? 'dislike' : 'neutral';
   // console.log('action in ad.service', action);
    const payload = { userId: this.getUserId(), adId, action };
    return this.http.post(`/like-dislike`, payload);
  }

  rateAdd(rate: Partial<RatingSubmitModel>) {
    //console.log('rateAdd called with payload:', rate);
    const payload: Partial<RatingSubmitModel> = {
      ...rate,
      userID: this.getLoggedUserId(), // Set the userID._id dynamically
    };

    return this.http.post<RatingSubmitModel>('/ratings/ad', payload).pipe(
      tap(() => console.log('Request successfully sent to the backend.')),
      catchError((error) => {
        console.error('Error rating ad:', error.message || error);
        return throwError(
          () => new Error('Failed to rate the ad. Please try again later.')
        );
      })
    );
  }

  getAdRates(
    adID: string
  ): Observable<{ ratings: RatingDisplayModel[]; averageRating: number }> {
    return this.http.get<{
      ratings: RatingDisplayModel[];
      averageRating: number;
    }>(`/ratings/ad/${adID}`);
  }

  // Get ads by category and subcategory
  getAdsByCategoryAndSubcategory(
    category: string,
    subCategory?: string
  ): Observable<AdData[]> {
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
        console.error(
          `Error fetching ads by category, subcategory, and price range`,
          error
        );
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

  private getLoggedUserId(): string {
    return this.userStore.getCurrentUserId() || 'N/A';
  }
  getTopRatedAds(): Observable<AdData[]> {
    return this.http.get<AdData[]>(`/ratings/top`);
  }
}
