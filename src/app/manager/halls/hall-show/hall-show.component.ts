import { Component } from '@angular/core';
import { HallsService } from 'src/app/services/halls.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Hall } from 'src/app/models/hall.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShowsService } from 'src/app/services/shows.service';
import { MoviesService } from 'src/app/services/movies.service';
import { Subscription } from 'rxjs';
import { Movie } from 'src/app/models/movie.model';

@Component({
    selector: 'app-hall-show',
    styleUrls: ['./hall-show.component.css'],
    templateUrl: './hall-show.component.html'
})
export class HallShowComponent{
    hallId: string;
    isMovie = true;
    hall: Hall;
    form: FormGroup;
    rows: number;
    moviesSub: Subscription
    // movies = [
    //     {id: "123", name: "john"},
    //     {id: "423", name: "sam"},
    //     {id: "523", name: "tom"},
    //     {id: "923", name: "ram"}
    // ];
    movies: Movie[] = [];
    selectedValue: string;
    alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
    rowsArray: string[];

    colsArray: string[] = ['1'];

    constructor(private hallsService: HallsService, private showsService: ShowsService, private moviesService: MoviesService,
        private route: ActivatedRoute, private router: Router) {}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('hallId')){
                this.hallId = paramMap.get('hallId');
                this.hallsService.getHall(this.hallId).subscribe(hallData => {
                    this.hall = {
                        id: hallData._id,
                        name: hallData.name,
                        theatreId: hallData.theatreId,
                        seats: hallData.seats,
                        cols: hallData.cols
                    };
                    this.seatLayout();
                });
            }                      
        });

        this.moviesService.getMoviesForManager();
        this.moviesSub = this.moviesService.getManagerMoviesUpdateListener()
            .subscribe((movies: Movie[]) => {
                this.movies = movies;
                });

        this.form = new FormGroup({
            movie: new FormControl(null, {validators: [Validators.required] }),
            date: new FormControl(null, {validators: [Validators.required] }),
            startTime: new FormControl(null, {validators: [Validators.required] }),
            endTime: new FormControl(null, {validators: [Validators.required] }),
            price: new FormControl(null, {validators: [Validators.required] })            
        });


    }

    seatLayout(){
        this.rows = this.hall.seats.length / this.hall.cols;
        this.rowsArray = this.alphabet.slice(0,this.rows);

        for (let step = 2; step <= this.hall.cols; step++) {
            this.colsArray.push(step.toString());
        }

    }

    addShow(){
        console.log(this.form.value);
        
        // this.showsService.addShow(this.form.value.movie.id, this.isMovie, this.hall.theatreId, this.hallId, this.form.value.date, 
        //     this.form.value.startTime, this.form.value.endTime, this.form.value.price, this.hall.seats, this.hall.cols);
    }

    
}