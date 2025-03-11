import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.css']
})
export class MyOffersComponent implements OnInit {
  currentTab = 'saved'; // Default to 'saved'
  jobs: any[] = [];
  user: any;

  toggleTab(tab: string): void {
    this.currentTab = tab;
    this.loadJobs(); // Reload jobs when switching tabs
  }

  constructor(private api: ApiService, private router: Router, private firestore: Firestore) {}

  ngOnInit(): void {
    // Ensure Firebase app is initialized and check the current user
    const auth = getAuth();
    this.user = auth.currentUser;
    if (this.user) {
      this.loadJobs();
    } else {
      console.error('User not logged in');
    }
  }

  async loadJobs() {
    if (!this.user) {
      console.error('User not logged in');
      return;
    }

    try {
      const userRef = doc(this.firestore, 'users', this.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error('User document not found.');
        return;
      }

      //Take the data from the Doc
      const userData = userSnap.data();
      if (!userData) {
        console.error('No user data found');
        return;
      }

      const jobIds: string[] = this.currentTab === 'saved' ? (userData['savedJobs'] || []) : (userData['appliedJobs'] || []);
      console.log('Job IDs to load:', jobIds);

      if (!jobIds.length) {
        this.jobs = [];
        return;
      }

      // Fetch jobs from the API based on the job IDs
      this.api.getJobs(50, '', '').subscribe(
        (response) => {
          // Filter the jobs based on the saved or applied job IDs
          this.jobs = response.jobs.filter((job: any) => jobIds.includes(job.id));
          console.log(`Loaded ${this.currentTab} jobs:`, this.jobs);
        },
        (error) => {
          console.error('Error loading jobs:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
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
