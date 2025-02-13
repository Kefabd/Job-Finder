import { Component, inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <h1>Welcome to the Protected Area</h1>
    <p>You are now logged in and viewing the protected app component.</p>
    <button (click)="logout()">Logout</button>
  `,
  styles: [`
    h1 { color: #2e7d32; }
    p { font-size: 1.2rem; }
    button { padding: 8px 16px; font-size: 1rem; }
  `]
})
export class HomeComponent {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
