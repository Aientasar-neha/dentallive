import { AuthServiceService } from './auth-service.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthServiceService, public router: Router) { }
  canActivate(): boolean {
    if (!this.auth.IsLoggedIn()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
