import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private auth: Auth = inject(Auth);
  private fb: FormBuilder = inject(FormBuilder);
  // Inject Firestore using the new modular API
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor() {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
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
    if (this.registerForm.invalid) return;

    const { firstName, lastName, email, password } = this.registerForm.value;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('Registered user:', userCredential.user);
      // Save additional user data to Firestore using the new modular API:
      await this.saveUserToFirestore(userCredential.user, {
        firstName,
        lastName,
      });
      await this.userService.saveUserToFirestore(userCredential.user, {
        firstName,
        lastName,
      });
      this.successMessage = 'Registration successful!';
      this.router.navigate(['/app']);
    } catch (error: any) {
      console.error('Registration error:', error);
      this.errorMessage = error.message;
    }
  }

  async registerWithGoogle() {
    this.errorMessage = '';
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      let firstName = '';
      let lastName = '';
      if (user.displayName) {
        const names = user.displayName.split(' ');
        firstName = names[0];
        lastName = names.slice(1).join(' ');
      }

      await this.userService.saveUserToFirestore(user, { firstName, lastName });

      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Google registration error:', error);
      this.errorMessage = error.message;
    }
  }

  // Use Firestore's doc() and setDoc() from the modular API
  private async saveUserToFirestore(
    user: any,
    data: { firstName: string; lastName: string }
  ) {
    try {
      // Create a user document in the 'users' collection using the user's UID
      const userRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userRef, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });
      console.log('User saved to Firestore:', user.uid);
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
    }
  }
}
