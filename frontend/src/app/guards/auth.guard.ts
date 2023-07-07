import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let userType;
    const loggedIn = this.authService.loggedIn();
    const requiredUserTypes: string[] = route.data['userType'];

    if (!loggedIn) {
      userType = 'unregistered';
    } else {
      userType = this.authService.getUserType();
    }

    // Check if the user type matches the required user type for the route
    if (requiredUserTypes.includes(userType)) {
      return true;
    } else {
      if (loggedIn) {
        this.router.navigate([`/${userType}`]);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
  }
}
