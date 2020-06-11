import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuthService } from '../services/userAuth.service';
import { Router } from '@angular/router';

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
    private userAuthListenerSubs: Subscription;

    constructor(public userAuthService: UserAuthService, public router: Router) {}

    ngOnInit(){
        this.cityId = localStorage.getItem('cityId');
        if(this.cityId != null) this.hasCityId = true;
        
        this.userIsAuthenticated = this.userAuthService.getIsAuth();
        this.userAuthListenerSubs = this.userAuthService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        });
    }

    onLogout() {
        this.userAuthService.logout();
    }

    ngOnDestroy(){
        this.userAuthListenerSubs.unsubscribe();
    }

}