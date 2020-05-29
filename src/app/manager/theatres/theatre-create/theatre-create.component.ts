import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TheatresService } from 'src/app/services/theatres.service';



@Component({
    selector: 'app-theatre-create',
    styleUrls: ['./theatre-create.component.css'],
    templateUrl: './theatre-create.component.html'
})
export class TheatreCreateComponent implements OnInit{

    form: FormGroup;

    constructor( public theatreService: TheatresService , public route: ActivatedRoute) {}

    ngOnInit(){
        this.form = new FormGroup({
            name: new FormControl(null, {validators: [Validators.required] })            
        });
    }


      addTheatre() {
        if (this.form.valid) {
          this.theatreService.addTheatre(this.form.value.name);
        }
      }

}