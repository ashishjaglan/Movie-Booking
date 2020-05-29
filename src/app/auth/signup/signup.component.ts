import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserAuthService } from '../../services/userAuth.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent{
    isLoading = false;

    constructor( public userAuthService: UserAuthService) {}


    onSignUp(form: NgForm){
        if(form.invalid){
            return;
        }
        //this.isLoading = true;
        this.userAuthService.createUser(form.value.email, form.value.password, form.value.name);
    }
}