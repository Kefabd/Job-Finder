import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.css']
})
export class MyOffersComponent implements OnInit {
  currentTab = 'saved'; // Default to 'saved'
  jobs: any[] = [];
  user: User | null = null;

  constructor(private api: ApiService, private router: Router, private firestore: Firestore) {}

  ngOnInit(): void {
    const auth = getAuth();
    
    // Wait for authentication state change
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        console.log('User authenticated:', user.uid);
        await this.loadJobs();
      } else {
        console.error('User not logged in');
      }
    });
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

      const userData = userSnap.data();
      if (!userData) {
        console.error('No user data found');
        return;
      }

      // Determine the correct job list to load
      const jobIds: string[] = this.currentTab === 'saved' ? (userData['savedJobs'] || []) : (userData['appliedJobs'] || []);
      console.log(`Loading ${this.currentTab} jobs with IDs:`, jobIds);

      if (!jobIds.length) {
        this.jobs = [];
        return;
      }

      // Fetch jobs from API and filter them
      this.api.getJobs(50, '', '').subscribe(
        (response) => {
          console.log('API Response:', response);
          
          if (!response || !response.jobs) {
            console.error('Invalid API response structure.');
            return;
          }

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

  toggleTab(tab: string): void {
    this.currentTab = tab;
    this.loadJobs(); // Reload jobs when switching tabs
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
