import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserAuthService } from '../../services/userAuth.service';
import { Subscription } from 'rxjs';
import { ManagerAuthService } from 'src/app/services/managerAuth.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
    hide = true;
    isLoading = false;
    userSignupDisplay = 1;
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

    onSignUp(form: NgForm){
        if(form.invalid){
            return;
        }
        this.isLoading = true;
        if(this.userSignupDisplay == 1){
            this.userAuthService.createUser(form.value.email, form.value.password, form.value.name);
        }else{
            this.managerAuthService.createManager(form.value.email, form.value.password, form.value.name);
        }
    }

    changeSignupDisplay(){
        this.userSignupDisplay = 1-this.userSignupDisplay;
    }

    ngOnDestroy() {
        this.userAuthStatusSub.unsubscribe();
        this.managerAuthStatusSub.unsubscribe();
    }
}