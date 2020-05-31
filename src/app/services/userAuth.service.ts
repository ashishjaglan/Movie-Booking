import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from '../auth/auth-data.model';

@Injectable({ providedIn: "root" })
export class UserAuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router){}

    getToken(){
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string, name: string){
        const authData: AuthData = {email: email, password: password, name: name};
        this.http.post('http://localhost:3000/api/user/signup', authData)
        .subscribe(response => {
            console.log(response);
            
        });
    }

    login(email: string, password: string){
        const authData: AuthData = {email: email, password: password, name: null};
        this.http.post<{ token: string, expiresIn: number, userId: string, username: string }>(
            'http://localhost:3000/api/user/login', 
            authData
            )
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                
                 if(token){
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                     this.isAuthenticated = true;
                     this.userId = response.userId;
                     this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    console.log(expirationDate);
                    this.saveAuthData(token, expirationDate, this.userId);
                     this.router.navigate(['/']);
                }            
            });
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated=true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.userId = null;
        this.clearAuthData();
         this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number){
        console.log("Setting timer: " + duration);        
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    //stores data to local storage
    private saveAuthData(token: string, expirationDate: Date, userId: string){
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if(!token || !expirationDate){
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }


}