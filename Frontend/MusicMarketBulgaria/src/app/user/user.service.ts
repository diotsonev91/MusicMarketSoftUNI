import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig'; // Adjust the path to your Firebase config file
import { User } from './user.model';    // Import the User interface

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private db = getFirestore();

  // Create a new user profile in Firestore
  async createUserProfile(uid: string, userData: User) {
    try {
      await setDoc(doc(this.db, "USERS", uid), userData);
      console.log("User profile created in Firestore!");
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  }

  // Retrieve a user profile from Firestore
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userDocRef = doc(this.db, "USERS", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data() as User; // Cast Firestore document data to User type
      } else {
        console.log("No user data found in Firestore!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }
}
