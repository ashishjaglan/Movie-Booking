import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserAuthService } from 'src/app/services/userAuth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
    hide = true;
    isLoading = false;
    private userAuthStatusSub: Subscription;

    constructor( public userAuthService: UserAuthService) {}

    ngOnInit() {
        this.userAuthStatusSub = this.userAuthService.getAuthStatusListener().subscribe(
            userAuthStatus => {
                this.isLoading = false;
            }
        );
    }

    onLogin(form: NgForm){
        if(form.invalid){
            return;
        }
        this.isLoading = true;
        this.userAuthService.login(form.value.email, form.value.password);
    }

    ngOnDestroy() {
        this.userAuthStatusSub.unsubscribe();
    }
}