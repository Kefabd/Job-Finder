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
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private auth: Auth = inject(Auth);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);

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
      const user = result.user;
  
      console.log('Google sign-in success:', user);
  
      // Check if user exists in Firestore
      const userExists = await this.userService.checkUserExists(user.uid);
  
      if (!userExists) {
        console.log('User not found in Firestore, saving...');
        let firstName = '';
        let lastName = '';
  
        if (user.displayName) {
          const names = user.displayName.split(' ');
          firstName = names[0];
          lastName = names.slice(1).join(' ');
        }
  
        await this.userService.saveUserToFirestore(user, { firstName, lastName });
      } else {
        console.log('User already exists in Firestore.');
      }
  
      // Store user session
      sessionStorage.setItem('user', String(user.displayName));
  
      // Redirect to home
      console.log('Redirecting to /home...');
      this.router.navigate(['/home']).then((success) => {
        console.log('Navigation result:', success);
      });
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      this.errorMessage = error.message;
    }
  }

}
