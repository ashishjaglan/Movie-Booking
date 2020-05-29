import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MoviesService } from 'src/app/services/movies.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-movie-create',
    styleUrls: ['./movie-create.component.css'],
    templateUrl: './movie-create.component.html'
})

export class MovieCreateComponent implements OnInit {
    form: FormGroup;

    constructor(public moviesService: MoviesService, public route: ActivatedRoute){}


    ngOnInit(){
        this.form = new FormGroup({
            name: new FormControl(null, {validators: [Validators.required] }),
            imagePath: new FormControl(null, {validators: [Validators.required] }),
            language: new FormControl(null, {validators: [Validators.required] }),
            duration: new FormControl(null, {validators: [Validators.required] }),
            description: new FormControl(null, {validators: [Validators.required] }),
            
        });
    }


    addMovie() {
        if (this.form.valid) {
          this.moviesService.addMovie(this.form.value.name, this.form.value.imagePath, this.form.value.language, 
            this.form.value.duration, this.form.value.description);
        }
    }
    

}