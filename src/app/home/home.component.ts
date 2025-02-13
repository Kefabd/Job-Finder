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
  title = 'myjobfinder';
  jobs: Job[] = [];

  constructor(private api: ApiService) {}

  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

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
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
