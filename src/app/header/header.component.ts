import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MoviesService } from '../services/movies.service';
import { UserAuthService } from '../services/userAuth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy{
    @Input() deviceXs: boolean;

    cityId: string;
    hasCityId: boolean = false;
    private cityIdSub: Subscription;
    userIsAuthenticated = false;
    private userAuthListenerSubs: Subscription;

    constructor(public moviesService: MoviesService, public userAuthService: UserAuthService) {}

    ngOnInit(){
        this.cityIdSub=this.moviesService.getCityIdUpdate().subscribe( (cityData: {updatedCityId: string}) => {
            this.cityId = cityData.updatedCityId;
            if(this.cityId != null) this.hasCityId = true;
        });

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