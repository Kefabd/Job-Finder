import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router) {}
  private auth = inject(Auth);  // Inject Auth service
  shouldShowNavbar(): boolean {
    return this.router.url !== '/login';  // Hide navbar on login page
  }
  handleLogout() {
    signOut(this.auth)  // Sign out the user
      .then(() => {
        this.router.navigate(['/login']);  // Redirect to login page after sign out
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }
  
}
