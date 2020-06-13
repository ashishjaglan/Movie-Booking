import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HallsService } from 'src/app/services/halls.service';

@Component({
    selector: 'app-hall-create',
    styleUrls: ['./hall-create.component.css'],
    templateUrl: './hall-create.component.html'
})
export class HallCreateComponent{
    form: FormGroup;
    theaterId: string;

    constructor(public hallsService: HallsService, public route: ActivatedRoute){}


    ngOnInit(){
        this.form = new FormGroup({
            name: new FormControl(null, {validators: [Validators.required] }),
            rows: new FormControl(null, {validators: [Validators.required] }),
            cols: new FormControl(null, {validators: [Validators.required] })            
        });

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('theatreId')){
                this.theaterId = paramMap.get('theatreId');
                // this.moviesService.getMovies(this.cityId);
                // this.moviesSub = this.moviesService.getMoviesUpdateListener()
                // .subscribe((moviesData:{movies: Movie[]}) => {
                //     this.movies = moviesData.movies;
                //   });
            }
        });
        
    }


    addHall() {
        if (this.form.valid) {
          this.hallsService.addHall(this.theaterId, this.form.value.name, this.form.value.rows, this.form.value.cols);
        }
    }
}