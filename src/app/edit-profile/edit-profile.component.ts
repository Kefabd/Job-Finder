import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Match the form structure to UserFormComponent
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

  ngOnInit() {
    if (this.data) {
      // Filter out fullName if not needed anymore
      const { fullName, ...formData } = this.data;
      this.profileForm.patchValue(formData);
      this.populateArray('experience', this.data.experience);
      this.populateArray('academicBackground', this.data.academicBackground);
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
          // Include userId in the document data
          const formData = {
            userId: user.uid,
            ...this.profileForm.value,
          };

          await setDoc(doc(this.firestore, 'users', user.uid), formData);
          this.dialogRef.close(true);
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }
    }
  }
}
