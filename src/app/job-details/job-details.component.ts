import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Job } from '../models';
import { Firestore, doc, getDoc, updateDoc, arrayUnion, setDoc } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  job: Job | null = null;
  showApplyPopup: boolean = false;
  isJobSaved: boolean = false;
  isJobApplied: boolean = false;
  
  constructor(private router: Router, private location: Location, private firestore: Firestore) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    // Retrieve the job data from router state
    this.job = history.state.job;
    // If no job was passed, redirect back to home
    if (!this.job) {
      this.router.navigate(['/']);
    }else{
      this.checkJobStatus();
    }
  }

  goBack(): void {
    this.location.back();
  }


  async saveJob(): Promise<void> {
    if (!this.job) return;
  
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to save jobs.');
      return;
    }
  
    try {
      const userRef = doc(this.firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        // Update the user's document to add the job ID to the savedJobs array
        await updateDoc(userRef, {
          savedJobs: arrayUnion(this.job.id) // Add job ID without duplicates
        });
        this.isJobSaved = true;
        console.log('Job saved successfully!');
      } else {
        alert('User document not found.');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save the job.');
    }
  }

  // Unsave job
  async unsaveJob(): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to unsave jobs.');
      return;
    }

    try {
      // Remove the job from user's saved jobs in Firestore
      const userRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const savedJobs = userDoc.data()['savedJobs'] || [];
        const updatedSavedJobs = savedJobs.filter((savedJobId: number) => savedJobId !== this.job?.id);

        await setDoc(userRef, { savedJobs: updatedSavedJobs }, { merge: true });
        this.isJobSaved = false;  // Update UI flag
        console.log('Job unsaved successfully!');
      }
    } catch (error) {
      console.error('Error unsaving job:', error);
      alert('Failed to unsave the job.');
    }
  }
  
  openApplyPopup(): void {
    // First redirect the user to the job application page
    if (this.job) {
      window.open(this.job.url, '_blank');
    }

    // Then show the popup asking if they applied
    this.showApplyPopup = true;
  }

  openAlreadyApplyPopup(): void {
    // First redirect the user to the job application page
    alert("You've already applied for this job");
  }


  // Check if the current job is saved or applied by the current user
  async checkJobStatus(): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const userRef = doc(this.firestore, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData) {
        // Check if the job ID is in the saved or applied jobs
        this.isJobSaved = userData['savedJobs']?.includes(this.job?.id);
        this.isJobApplied = userData['appliedJobs']?.includes(this.job?.id);
      }
    } else {
      console.error('User document not found');
    }
  }
  
  async handleApplyResponse(didApply: boolean): Promise<void> {
    if (didApply && this.job) {

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to track applied jobs.');
        return;
      }

      try {
        const userRef = doc(this.firestore, 'users', user.uid);
        
        // Update the user's document to add the job ID to the appliedJobs array
        await updateDoc(userRef, {
          appliedJobs: arrayUnion(this.job.id) // Add job ID without duplicates
        });
        this.isJobApplied = true;

        console.log('Great! We\'ve marked this job as applied.');
      } catch (error) {
        console.error('Error marking job as applied:', error);
        alert('Failed to mark the job as applied.');
      }
    }
    
    // Close the popup
    this.showApplyPopup = false;
  }
}