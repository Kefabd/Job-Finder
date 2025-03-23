import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  jobs: any[] = [];
  title: string = 'Job Search App';
  userEmail: string | null = null;

  constructor(private api: ApiService, private router: Router) {
    // Get user email from localStorage or another authentication service
    this.userEmail = localStorage.getItem('userEmail');
    this.userEmail = sessionStorage.getItem('user'); // Example implementation
  }

  ngOnInit(): void {
    this.loadJobs(); // Initial load of jobs
  }

  loadJobs(jobTitles: string[] = [], location: string = '', jobType: string = '', salaryRange: string = '') {
    // Call the API with the search parameters
    this.api.getJobs(50, location, jobTitles.join(',')).subscribe(
      (response) => {
        let filteredJobs = response.jobs;
  
        // Filter jobs based on jobType if it is defined
        if (jobType) {
          filteredJobs = filteredJobs.filter(job => job.jobType && job.jobType.includes(jobType.toLowerCase()));
        }
  
        // Assign the filtered jobs to the jobs array
        this.jobs = filteredJobs;
        console.log('Filtered API Response:', this.jobs);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  sortJobs(event: Event) {
    const target = event.target as HTMLSelectElement;
    const criteria = target.value;

    if (criteria === 'date') {
      this.jobs.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    } else if (criteria === 'alphabetical') {
      this.jobs.sort((a, b) => a.jobTitle.localeCompare(b.jobTitle));
    }
  }
  
  

  // Handle the search event from the search bar component
  onSearch(searchData: any): void {
    this.loadJobs(searchData.jobTitles, searchData.location.toLowerCase(), searchData.jobType, searchData.salaryRange);
  }
  
  viewJobDetails(job: any): void {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    sessionStorage.setItem('restoreScroll', 'true');

    this.router.navigate(['/job-details'], { state: { job } }).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  }

  
  // Added missing method
  logout(): void {
    const auth = getAuth();
    signOut(auth)  // Firebase signOut method
      .then(() => {
        // Clear session storage or local storage as necessary
        sessionStorage.removeItem('user');
        localStorage.removeItem('userEmail'); // if you're using localStorage for storing the email

        console.log('User logged out successfully');
        
        // Navigate the user to the login page after logging out
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  }
}
