import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrl: './my-offers.component.css'
})
export class MyOffersComponent {
  currentTab = 'saved'; // Default to 'saved'
  jobs: any[] = [];
  toggleTab(tab: string): void {
    this.currentTab = tab;
  }
  constructor(private api: ApiService, private router: Router) {
    
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
  
}
