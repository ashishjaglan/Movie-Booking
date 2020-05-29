import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserAuthService } from 'src/app/services/userAuth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent{

    constructor(public authService: UserAuthService){}

    onLogin(form: NgForm){
        if(form.invalid){
            return;
        }
        
        this.authService.login(form.value.email, form.value.password);
    }
}