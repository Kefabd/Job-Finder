import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  // When no path is provided, redirect to the login page
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Define routes for the authentication pages
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // You can add more routes here for other parts of your application.
  // Redirect any unknown paths to the login page (or a 404 page if you prefer)
  { path: '**', redirectTo: '/login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
