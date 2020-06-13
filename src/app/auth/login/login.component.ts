import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserAuthService } from 'src/app/services/userAuth.service';
import { Subscription } from 'rxjs';
import { ManagerAuthService } from 'src/app/services/managerAuth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
    hide = true;
    isLoading = false;
    userLoginDisplay = 1;
    private userAuthStatusSub: Subscription;
    private managerAuthStatusSub: Subscription;

    constructor( public userAuthService: UserAuthService, private managerAuthService: ManagerAuthService) {}

    ngOnInit() {
        this.userAuthStatusSub = this.userAuthService.getAuthStatusListener().subscribe(
            userAuthStatus => {
                this.isLoading = false;
            }
        );
        this.managerAuthStatusSub = this.managerAuthService.getAuthStatusListener().subscribe(
            managerAuthStatus => {
                this.isLoading = false;
            }
        );
    }

    onLogin(form: NgForm){
        if(form.invalid){
            return;
        }
        this.isLoading = true;
        if(this.userLoginDisplay==1){
            this.userAuthService.login(form.value.email, form.value.password);
        }else{
            this.managerAuthService.login(form.value.email, form.value.password);
        }
    }

    changeLoginDisplay(){
        this.userLoginDisplay = 1-this.userLoginDisplay;
    }

    ngOnDestroy() {
        this.userAuthStatusSub.unsubscribe();
        this.managerAuthStatusSub.unsubscribe();
    }
}