import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from '@angular/fire/auth';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  loading = true;
  error = '';

  constructor(private firestore: Firestore, public dialog: MatDialog) {}

  openEditDialog() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '600px',
      data: this.userProfile,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit(); // Refresh data after edit
    });
  }
  async ngOnInit() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        this.error = 'User not authenticated';
        return;
      }

      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        this.userProfile = userDoc.data();
      } else {
        this.error = 'Profile not found. Please create one.';
      }
    } catch (err) {
      this.error = 'Error loading profile';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
