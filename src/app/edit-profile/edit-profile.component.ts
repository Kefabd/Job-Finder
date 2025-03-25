import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Firestore, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: any = {};

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      photoUrl: [''],
      resumeUrl: [''],
      experience: this.fb.array([]),
      academicBackground: this.fb.array([]),
      savedJobs: [[]],
      appliedJobs: [[]],
    });
  }

  async ngOnInit() {
    // Charger le profil utilisateur depuis Firestore
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        this.userProfile = userDoc.data();
        this.profileForm.patchValue(this.userProfile);
        this.populateArray('experience', this.userProfile.experience || []);
        this.populateArray(
          'academicBackground',
          this.userProfile.academicBackground || []
        );
      }
    }
  }

  get experience() {
    return this.profileForm.get('experience') as FormArray;
  }

  get academicBackground() {
    return this.profileForm.get('academicBackground') as FormArray;
  }

  private populateArray(controlName: string, data: any[]) {
    const control = this.profileForm.get(controlName) as FormArray;
    data.forEach((item) => control.push(this.fb.group(item)));
  }

  addExperience() {
    this.experience.push(
      this.fb.group({
        title: [''],
        company: [''],
        startDate: [''],
        endDate: [''],
        description: [''],
      })
    );
  }

  addEducation() {
    this.academicBackground.push(
      this.fb.group({
        institution: [''],
        degree: [''],
        fieldOfStudy: [''],
        startDate: [''],
        endDate: [''],
      })
    );
  }

  async saveChanges() {
    if (this.profileForm.valid) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(this.firestore, 'users', user.uid);
          await updateDoc(userDocRef, this.profileForm.value);
          // Après enregistrement, naviguer vers la page de profil
          this.router.navigate(['/settings']);
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }
    }
  }

  cancel() {
    this.router.navigate(['/settings']);
  }
}
