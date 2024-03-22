import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
    private baseUrl: string = environments.baseUrl;
    private user?: User;
    constructor(private http: HttpClient) { }


    get currentUser() :User | undefined{
        if(!this.user) return undefined;
        return structuredClone(this.user);
    }

    public login(email: string, password: string) :Observable<User>{
        const url = `${this.baseUrl}/users/1`;
        return this.http.get<User>(url)
        .pipe(
            tap(user => this.user = user),
            tap(user => localStorage.setItem('token', JSON.stringify(user)))
        );
    }

    public checkAuth():Observable<boolean>{
        if(!localStorage.getItem('token')) return of(false);

        const token = localStorage.getItem('token');

        return this.http.get<User>(`${this.baseUrl}/users/1`)
        .pipe(
            tap(user => this.user = user),
            map(user => !!user),
            catchError(() => of(false))
        );

    }


    public register(email: string, password: string, user: string) :Observable<User>{
        const url = `${this.baseUrl}/auth/register`;
        return this.http.post<User>(url, { email, password, user })
        .pipe(
            tap(user => this.user = user),
            tap(user => localStorage.setItem('token', JSON.stringify(user)))
        );
    }

    public logout(){
        this.user = undefined;
        localStorage.clear();
    }
 


    
}