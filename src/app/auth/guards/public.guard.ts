import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';


export const isloginGuardActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ) => {

        const router = inject(Router);
        const authService = inject(AuthService);

        return authService.checkAuth()
        .pipe(
            tap(response =>{
                if(!!response) router.navigate(['heroes/list']) 
            }
            ),
            map(response =>{
                return !response?true:response;
            })
        )

}


export const isLoginGuardMatch: CanMatchFn = (
    route: Route,
    segments: UrlSegment[]
) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.checkAuth()
    .pipe(
        tap(response =>{
            if(!!response) router.navigate(['heroes/list']) 
        }
        ),
        map(response =>{
            return !response?true:response;
        })
    )
}