import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  resetForm: FormGroup;
  errorMessage: string = '';
  emailSent: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  async resetPassword() {
    if (this.resetForm.invalid) {
      return;
    }
    const email = this.resetForm.get('email')?.value;
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.emailSent = true;
      this.errorMessage = '';
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'No user found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'The email address is not valid.';
      } else {
        this.errorMessage = error.message;
      }
    }
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
