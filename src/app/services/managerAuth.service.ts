import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ManagerAuthData } from '../auth/managerAuth-data.model';


@Injectable({ providedIn: "root" })
export class ManagerAuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private managerId: string;
    private managerName: string;
    private managerCityId: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router){}

    getToken(){
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getManagerId() {
        return this.managerId;
    }

    getManagerName() {
        return this.managerName;
    }

    getManagerCityId() {
        return this.managerCityId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createManager(email: string, password: string, name: string){
        const authData: ManagerAuthData = {email: email, password: password, name: name, cityId: null};
        this.http.post('http://localhost:3000/api/manager/signup', authData)
        .subscribe(() => {
            this.router.navigate(["/"]);
        }, error => {
            this.authStatusListener.next(false);
        });
    }

    login(email: string, password: string){
        const managerAuthData: ManagerAuthData = {email: email, password: password, name: null, cityId: null};
        this.http.post<{ token: string, expiresIn: number, managerId: string, managername: string, managerCityId: string }>(
            'http://localhost:3000/api/manager/login', 
            managerAuthData
            )
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                
                 if(token){
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                     this.isAuthenticated = true;
                     this.managerId = response.managerId;
                     this.managerName = response.managername;
                     this.managerCityId = response.managerCityId;
                     this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    console.log(expirationDate);
                    this.saveAuthData(token, expirationDate, this.managerId, this.managerName, this.managerCityId);
                    if(this.managerCityId == ""){
                        this.router.navigate(["/manager/city"]);
                    }else{
                        this.router.navigate(['/manager/theatreList']);
                    }
                }    
            }, error => {
                this.authStatusListener.next(false);
            });
    }

    autoAuthManager(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated=true;
            this.managerId = authInformation.managerId;
            this.managerCityId = authInformation.managerCityId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.managerId = null;
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
    private saveAuthData(token: string, expirationDate: Date, managerId: string, managerName: string, managerCityId: string){
        localStorage.setItem('managerToken', token);
        localStorage.setItem('managerExpiration', expirationDate.toISOString());
        localStorage.setItem('managerId', managerId);
        localStorage.setItem('managerName', managerName);
        localStorage.setItem('managerCityId', managerCityId);
        localStorage.removeItem('cityId');
    }

    private clearAuthData(){
        localStorage.removeItem('managerToken');
        localStorage.removeItem('managerExpiration');
        localStorage.removeItem('managerId');
        localStorage.removeItem('managerName');
        localStorage.removeItem('managerCityId');
    }

    private getAuthData() {
        const token = localStorage.getItem('managerToken');
        const expirationDate = localStorage.getItem('managerExpiration');
        const managerId = localStorage.getItem('managerId');
        const managerName = localStorage.getItem('managerName');
        const managerCityId = localStorage.getItem('managerCityId');
        if(!token || !expirationDate){
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            managerId: managerId,
            managerName: managerName,
            managerCityId: managerCityId
        }
    }


}