import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Job } from '../models';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  job: Job | null = null;
  showApplyPopup: boolean = false;
  
  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    // Retrieve the job data from router state
    this.job = history.state.job;
    // If no job was passed, redirect back to home
    if (!this.job) {
      this.router.navigate(['/']);
    }
  }

  goBack(): void {
    this.location.back();
  }
  
  saveJob(): void {
    // Get existing saved jobs from localStorage or initialize empty array
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    // Check if job is already saved
    const isJobSaved = savedJobs.some((savedJob: Job) => savedJob.url === this.job?.url);
    
    if (!isJobSaved && this.job) {
      // Add current job to saved jobs
      savedJobs.push(this.job);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      alert('Job saved successfully!');
    } else {
      alert('This job is already saved.');
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
  
  handleApplyResponse(didApply: boolean): void {
    if (didApply && this.job) {
      // Track that the user applied for this job
      const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      
      if (!appliedJobs.some((job: Job) => job.url === this.job?.url)) {
        appliedJobs.push(this.job);
        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
      }
      
      alert('Great! We\'ve marked this job as applied.');
    }
    
    // Close the popup
    this.showApplyPopup = false;
  }
}