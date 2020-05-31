import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserAuthService } from '../services/userAuth.service';

@Injectable()
export class UserAuthGuard implements CanActivate {

    constructor(private userAuthService: UserAuthService, private router: Router) {}

    canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        const isAuth = this.userAuthService.getIsAuth();
        if(!isAuth){
            this.router.navigate(['/login']);
        }
        return isAuth;
    }
}