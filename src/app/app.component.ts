import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Job } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'myjobfinder';
  jobs: Job[] = [];


  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getJobs(5, 'usa', 'data-science').subscribe(
      (response) => {
        console.log('API Response:', response); // Log the response
        this.jobs = response.jobs;
      },
      (error) => {
        console.error('API Error:', error); // Log any errors
      }
    );
  }}