import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  jobs: any[] = [];
  title: string = 'Job Search App'; // Added missing property
  userEmail: string | null = null; // Added missing property

  constructor(private api: ApiService, private router: Router) {
    // Get user email from localStorage or another authentication service
    this.userEmail = localStorage.getItem('userEmail'); // Example implementation
  }

  ngOnInit(): void {
    this.api.getJobs(9, 'usa', 'data-science').subscribe(
      (response) => {
        console.log('API Response:', response);
        this.jobs = response.jobs;
  
        // Smoothly restore the scroll position if needed
        if (sessionStorage.getItem('restoreScroll') === 'true') {
          const scrollPosition = sessionStorage.getItem('scrollPosition');
          if (scrollPosition) {
            setTimeout(() => {
              window.scrollTo({ top: parseInt(scrollPosition, 10), behavior: 'smooth' });
            }, 100); // Small delay to ensure smooth scrolling after rendering
          }
          // Clean up sessionStorage to prevent unwanted restoration on refresh
          sessionStorage.removeItem('restoreScroll');
          sessionStorage.removeItem('scrollPosition');
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
  
  viewJobDetails(job: any): void {
    // Save the current scroll position and set the restoration flag
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    sessionStorage.setItem('restoreScroll', 'true');
  
    // Navigate to job details
    this.router.navigate(['/job-details'], { state: { job } }).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100); // Ensure the page is loaded before scrolling
    });
  }
  
  // Added missing method
  logout(): void {
    // Implement logout logic
    localStorage.removeItem('userEmail'); // Example implementation
    this.router.navigate(['/login']); // Navigate to login page
  }
}