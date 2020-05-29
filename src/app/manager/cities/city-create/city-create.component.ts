import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CitiesService } from 'src/app/services/cities.service';
import { ActivatedRoute } from '@angular/router';



@Component({
    selector: 'app-city-create',
    styleUrls: ['./city-create.component.css'],
    templateUrl: './city-create.component.html'
})
export class CityCreateComponent implements OnInit{

    form: FormGroup;

    constructor(public citiesService: CitiesService, public route: ActivatedRoute) {}

    ngOnInit(){
        this.form = new FormGroup({
            name: new FormControl(null, {validators: [Validators.required] })            
        });
    }


      addCity() {
        if (this.form.valid) {
          this.citiesService.addCity(this.form.value.name);
        }
      }

}