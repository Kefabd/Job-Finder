import { Component, inject, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { ApiService } from '../services/api.service';
import { Job } from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{
  title = 'My Job Finder';
  jobs: Job[] = [];
  userEmail: string | null = null;

  constructor(private api: ApiService) {}

  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  ngOnInit() {
    const userDataString = sessionStorage.getItem('user');
    if (userDataString) {
      try {
        this.userEmail = JSON.parse(userDataString);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.router.navigate(['/login']); // Redirect if data is invalid
      }
    } else {
      // If no user data is found, redirect to login
      this.router.navigate(['/login']);
    }


    this.api.getJobs(9, 'usa', 'data-science').subscribe(
      (response) => {
        console.log('API Response:', response); // Log the response
        this.jobs = response.jobs;
      },
      (error) => {
        console.error('API Error:', error); // Log any errors
      }
    );
  }

  async logout() {
    await signOut(this.auth);
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
