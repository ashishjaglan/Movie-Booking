import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserAuthService } from '../../services/userAuth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
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

    onSignUp(form: NgForm){
        if(form.invalid){
            return;
        }
        this.isLoading = true;
        this.userAuthService.createUser(form.value.email, form.value.password, form.value.name);
    }

    ngOnDestroy() {
        this.userAuthStatusSub.unsubscribe();
    }
}