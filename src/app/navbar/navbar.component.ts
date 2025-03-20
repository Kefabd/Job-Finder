import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentRoute!: string;
  userName: string = 'User';
  userEmail: string = '';
  userPic: string | null = ''; // Default profile picture

  private auth = inject(Auth);
  private firestore = inject(Firestore); // Inject Firestore

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit() {
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        this.userName = user.displayName || 'No Name';
        this.userEmail = user.email || 'No Email';
        this.userPic = user.photoURL;
        //await this.fetchUserProfile(user.uid); // Fetch user details from Firestore
      } else {
        this.userName = 'Guest';
        this.userEmail = '';
        this.userPic = 'assets/default-profile.png';
        console.log('No user logged in');
      }
    });
  } 

  async fetchUserProfile(userId: string) {
    try {
      const userDocRef = doc(this.firestore, `users/${userId}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        this.userPic = userData['photoUrl'] || 'assets/default-profile.png';
        console.log(this.userPic);
      } else {
        console.log('No user data found in Firestore');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  shouldShowNavbar(): boolean {
    return this.router.url !== '/login';
  }

  handleLogout() {
    signOut(this.auth)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }
}
