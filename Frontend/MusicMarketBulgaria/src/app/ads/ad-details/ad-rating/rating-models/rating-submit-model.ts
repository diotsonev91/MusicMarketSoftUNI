export interface RatingSubmitModel {
    adID: string;
    userID: string; // Only the user ID as a string
    ratingValue: number;
    reviewText: string | null;
  }
  