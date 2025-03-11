import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserFormComponent } from './user-form/user-form.component';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'app', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'job-details', component: JobDetailsComponent},
  { path: 'user-form', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
