import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router) { }


    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        return new Observable(
            (observer) => {
                this.authService.isAuth.subscribe(
                    (auth) => {
                        if (auth) {
                            observer.next(true);
                        } else {
                            this.router.navigate(['/users/login']);
                        }
                    }
                );
            }
        );
    }
}
