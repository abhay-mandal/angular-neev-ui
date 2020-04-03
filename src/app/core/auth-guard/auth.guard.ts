import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from '@app/core/services/data.service'
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    private dataService: DataService) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isUserLoggedIn()) {
      if (state.url.includes("/page")) {
        localStorage.setItem("redirectUrlMyPage", state.url);
      }
      this.authService.redirectToLogIn();
      return true;
    } else {
      //Added random logic to test auth guard
      if (state.url == "/user-profile") {
        return false;
      } else {
        if (this.dataService.getIsInterval()) {
          this.authService.setIntervalForSession();
        }
        return true;
      }
    }
  }

}
