import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { clientStorage } from '../ClientStorage';
import { AuthService } from 'src/app/auth/signup/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router, private authS: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // let user = clientStorage.getUserData();
    // if (user == null) {
    //   this.router.navigateByUrl(''); // login page
    //   return false;
    // }

    let isAuth = this.authS.getIsAuth();
    if (!isAuth) {
      this.router.navigate(["/"]); // login page
    }
    // if (!token || token == null || token.length == 0) {
    //   this.router.navigateByUrl('') // login page
    //   return false;
    // }

    return isAuth;
  }


  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }


  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
