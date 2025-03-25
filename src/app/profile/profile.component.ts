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
  userProfile: any = {};
  loading = true;
  hasProfile = false;
  editMode = false;

  getInitials(firstName: string, lastName: string): string {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.toUpperCase() : '';
    return first + last;
  }

  constructor(private firestore: Firestore, public dialog: MatDialog) {}

  async ngOnInit() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        this.userProfile = null;
        return;
      }

      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        this.userProfile = userDoc.data();
        this.hasProfile = true;
        console.log(this.userProfile);
      } else {
        this.userProfile = {};
        this.hasProfile = false;
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      this.loading = false;
    }
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '600px',
      data: this.userProfile,
    });

    // Close the dialog and reset the edit mode
    dialogRef.afterClosed().subscribe(() => {
      this.editMode = false;
      this.ngOnInit(); // Reload the profile after saving
    });
    
    this.editMode =true;
  }
}
