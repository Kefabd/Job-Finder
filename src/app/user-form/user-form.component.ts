import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  private userService: UserService = inject(UserService);

  constructor(private fb: FormBuilder, private firestore: Firestore) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      photoUrl: [''],
      resumeUrl: [''],
      experience: this.fb.array([]), // Experience as an array
      academicBackground: this.fb.array([]), // Education as an array
      savedJobs: [[]], // Initialize empty array
      appliedJobs: [[]],
    });
  }

  ngOnInit(): void {
    const auth = getAuth();
    console.log(auth.currentUser);
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
  

  async submitForm() {
    if (this.userForm.valid) {
      const formData = {
        userId: getAuth().currentUser?.uid,
        ...this.userForm.value, // Spread operator to include all form fields
      };
  
      try {
        // Call the service method to save user data
        await this.userService.updateUserData(formData);
        alert('User profile successfully saved!');
        this.userForm.reset(); // Reset the form after submission
      } catch (error: any) {
        console.error('Error saving user data:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  }
  
}
