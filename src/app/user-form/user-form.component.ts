import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private firestore: Firestore) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      photoUrl: [''],
      resumeUrl: [''],
      experience: this.fb.array([]), // Experience as an array
      academicBackground: this.fb.array([]), // Education as an array
      savedJobs: [[]], // Initialize empty array
      appliedJobs: [[]],
    });
  }

  // Getter for experience
  get experience(): FormArray {
    return this.userForm.get('experience') as FormArray;
  }

  // Getter for academic background
  get academicBackground(): FormArray {
    return this.userForm.get('academicBackground') as FormArray;
  }

  // Add a new experience field
  addExperience() {
    this.experience.push(this.fb.group({
      title: [''],
      company: [''],
      startDate: [''],
      endDate: [''],
      description: ['']
    }));
  }

  // Add a new academic background field
  addAcademicBackground() {
    this.academicBackground.push(this.fb.group({
      institution: [''],
      degree: [''],
      fieldOfStudy: [''],
      startDate: [''],
      endDate: ['']
    }));
  }
  

  // Submit form data to Firestore
  async submitForm() {
    if (this.userForm.valid) {
      const auth = getAuth();
      const user = auth.currentUser;

      console.log(user)

      if (!user) {
        alert('You must be logged in to submit the form.');
        return;
      }

      const userId = user.uid;
      const userDocRef = doc(this.firestore, 'users', userId);

      const formData = {
        userId,
        ...this.userForm.value // Spread operator to take all form data
      };

      try {
        await setDoc(userDocRef, formData);
        alert('User profile successfully saved!');
        this.userForm.reset(); // Reset the form after submission
      } catch (error) {
        console.error('Error saving user data:', error);
        alert('An error occurred. Please try again. ');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
