import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, tap } from 'rxjs';

function checkAuthStatus(): boolean |Observable<boolean>{
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.checkAuth().pipe(
        tap(isAuth => console.log('isAuth', isAuth)),
        tap(
        isAuth => {
            if(!isAuth) router.navigate(['/auth/login']);
        }
        )

    );
}

//canActivate decide quién puede usar algo.
export const canActivatedGuard: CanActivateFn =( 
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
)=>{
    console.log('canActivatedGuard');
    return checkAuthStatus();
}


//canMatch decide si algo está disponible.
export const canMatchGuard: CanMatchFn =(
    route: Route,
    segments: UrlSegment[]
)=>{
    console.log('canMatchGuard');
    return checkAuthStatus();
}