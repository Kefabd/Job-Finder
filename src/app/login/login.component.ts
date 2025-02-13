import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Inject AngularFire Auth and FormBuilder
  private auth: Auth = inject(Auth);
  private fb: FormBuilder = inject(FormBuilder);

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async login() {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Logged in user:', userCredential.user);
      // Optionally redirect the user or perform additional actions upon successful login
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = error.message;
    }
  }
}
