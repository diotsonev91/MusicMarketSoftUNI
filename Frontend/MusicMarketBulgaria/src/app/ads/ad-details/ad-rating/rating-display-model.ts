import { UserData } from "../../../user/user-data.model";


export interface RatingDisplayModel {
    _id: string;
    adID: string;
    userID: {
      _id: string;
      username: string;
      email: string;
    }; // Fully populated user object for display
    ratingValue: number;
    reviewText: string;
    createdAt: string;
    updatedAt: string;
  }
  