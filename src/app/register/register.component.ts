import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Inject AngularFire Auth and FormBuilder
  private auth: Auth = inject(Auth);
  private fb: FormBuilder = inject(FormBuilder);

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor() {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async register() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.registerForm.invalid) {
      return;
    }

    const { email, password } = this.registerForm.value;
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Registered user:', userCredential.user);
      this.successMessage = 'Registration successful! You can now log in.';
      // Optionally, redirect the user to the login page
    } catch (error: any) {
      console.error('Registration error:', error);
      this.errorMessage = error.message;
    }
  }
}
