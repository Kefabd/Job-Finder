// auth.guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { delay, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  // canActivate(): Observable<boolean | UrlTree> {
  //   return authState(this.auth).pipe(
  //     take(1),
  //     map(user => {
  //       console.log('AuthGuard user:', user);
  //       return user ? true : this.router.parseUrl('/login');
  //     })
  //   );
  // }

  canActivate(): Observable<boolean | UrlTree> {
    return authState(this.auth).pipe(
      delay(100), // wait 100ms
      take(1),
      map(user => {
        console.log('AuthGuard user after delay:', user);
        return user ? true : this.router.parseUrl('/login');
      })
    );
  }
}
