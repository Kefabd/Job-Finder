import { Injectable, inject  } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore: Firestore = inject(Firestore);

  constructor() { }

  async saveUserToFirestore(user: any, data: { firstName: string, lastName: string }) {
    try {
      const userRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userRef, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });
      console.log('User saved to Firestore:', user.uid);
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
    }
  }

  async checkUserExists(uid: string): Promise<boolean> {
    const userRef = doc(this.firestore, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  }

  async getUserByUid(uid: string): Promise<any | null> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        console.log('No user found with UID:', uid);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving user from Firestore:', error);
      return null;
    }
  }

  // Method to update user data in Firestore
  async updateUserData(formData: any): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('User must be logged in');
    }

    const userId = user.uid;
    const userDocRef = doc(this.firestore, 'users', userId);

    try {
      await updateDoc(userDocRef, formData); // Update existing user data
      console.log('User profile successfully updated!');
    } catch (error) {
      console.error('Error updating user data:', error);
      throw new Error('An error occurred while updating user data');
    }
  }
}
