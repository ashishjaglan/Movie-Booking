import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuthService } from '../services/userAuth.service';
import { Router } from '@angular/router';
import { ManagerAuthService } from '../services/managerAuth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy{
    @Input() deviceXs: boolean;

    cityId: string;
    hasCityId: boolean = false;
    userIsAuthenticated = false;
    managerIsAuthenticated = false;
    private userAuthListenerSubs: Subscription;
    private managerAuthListenerSubs: Subscription;

    constructor(public userAuthService: UserAuthService, public managerAuthService: ManagerAuthService, public router: Router) {}

    ngOnInit(){
        this.cityId = localStorage.getItem('cityId');
        if(this.cityId != null) this.hasCityId = true;
        
        this.userIsAuthenticated = this.userAuthService.getIsAuth();
        this.userAuthListenerSubs = this.userAuthService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        });

        this.managerIsAuthenticated = this.managerAuthService.getIsAuth();
        this.managerAuthListenerSubs = this.managerAuthService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.managerIsAuthenticated = isAuthenticated;
        });
    }

    onLogout() {
        if(this.userIsAuthenticated){
            this.userAuthService.logout();
        }else{
            this.managerAuthService.logout();
        }
    }

    ngOnDestroy(){
        this.userAuthListenerSubs.unsubscribe();
        this.managerAuthListenerSubs.unsubscribe();
    }

}