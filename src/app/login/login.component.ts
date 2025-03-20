import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  user,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private auth: Auth = inject(Auth);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async login() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('Logged in user:', userCredential.user);
      sessionStorage.setItem('user', JSON.stringify(email));
      // Redirect to the protected route
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = error.message;
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      console.log('Google sign in success:', result.user);

      console.log('Redirecting to /home...');
      this.router.navigate(['/home']).then((success) => {
        console.log('Redirecting to /app...');
        sessionStorage.setItem('user', String(result.user.displayName));
        this.router.navigate(['/home']).then((success) => {
          console.log('Navigation result:', success);
        });
      });
    } catch (error: any) {
      console.log('Redirecting to /app...');
      // sessionStorage.setItem('user', String(result.user.displayName));
      this.router.navigate(['/home']).then((success) => {
        console.log('Navigation result:', success);
      });
    }
  }
  catch(error: any) {
    console.error('Google sign in error:', error);
    this.errorMessage = error.message;
  }
}
