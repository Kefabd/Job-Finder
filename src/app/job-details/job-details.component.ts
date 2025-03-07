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

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
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
}
