import { Component, inject, OnInit } from '@angular/core';
import { Auth, getAuth, signOut } from '@angular/fire/auth';
import { ApiService } from '../services/api.service';
import { Job } from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'My Job Finder';
  jobs: Job[] = [];
  userEmail: string | null = null;

  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  constructor(private api: ApiService) {}

  ngOnInit() {
    console.log('HomeComponent (JobFinderComponent) initialized');

    // Use Firebase Auth to check for the current user
    const currentUser = this.auth.currentUser;
    if (currentUser && currentUser.email) {
      this.userEmail = currentUser.email;
    } else {
      // If no user is found, redirect to login
      console.error('No authenticated user found.');
      this.router.navigate(['/login']);
      return;
    }

    // Fetch jobs from your API
    this.api.getJobs(9, 'usa', 'data-science').subscribe(

      (response) => {
        console.log('API Response:', response);
        this.jobs = response.jobs;
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
