import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service'; // Import the ApiService

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  searchTerm: string = '';
  locationSearch: string = '';
  selectedJobs: string[] = [];
  selectedJobType: string = '';
  selectedSalaryRange: string = '';
  jobTypes: string[] = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  salaryRanges: string[] = ['$40k-$60k', '$60k-$80k', '$80k-$100k', '$100k+'];

  jobSuggestions: string[] = [];
  locationSuggestions: string[] = [];
  filteredJobs: string[] = [];
  filteredLocations: string[] = [];

  @Output() searchEvent: EventEmitter<any> = new EventEmitter();
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    // Fetch job titles and location suggestions on initialization
    this.fetchJobSuggestions();
    this.fetchLocationSuggestions();
  }

  // Fetch job titles from the API
  fetchJobSuggestions(): void {
    this.api.getJobs().subscribe(
      (response) => {
        // Extract job titles from the API response
        this.jobSuggestions = response.jobs.map(job => job.jobTitle);
      },
      (error) => {
        console.error('Error fetching job titles:', error);
      }
    );
  }

  // Fetch location suggestions from the API
  fetchLocationSuggestions(): void {
    this.api.getJobs().subscribe(
      (response) => {
        // Extract job locations from the API response
        this.locationSuggestions = [...new Set(response.jobs.map(job => job.jobGeo))]; // Remove duplicates
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }

  filterJobs() {
    this.filteredJobs = this.searchTerm ? 
      this.jobSuggestions.filter(job => job.toLowerCase().includes(this.searchTerm.toLowerCase())) : [];
  }

  selectJob(job: string) {
    if (!this.selectedJobs.includes(job)) {
      this.selectedJobs.push(job);
    }
    this.searchTerm = '';
    this.filteredJobs = [];
  }

  removeJob(job: string) {
    this.selectedJobs = this.selectedJobs.filter(j => j !== job);
  }

  filterLocations() {
    this.filteredLocations = this.locationSearch ? 
      this.locationSuggestions.filter(loc => loc.toLowerCase().includes(this.locationSearch.toLowerCase())) : [];
  }

  selectLocation(location: string) {
    this.locationSearch = location;
    this.filteredLocations = [];
  }

  onSearch() {
    const searchData = {
      jobTitles: this.selectedJobs,
      location: this.locationSearch,
      jobType: this.selectedJobType,
      salaryRange: this.selectedSalaryRange
    };
    this.searchEvent.emit(searchData);
  }
}
