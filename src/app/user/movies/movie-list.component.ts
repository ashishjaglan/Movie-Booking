import { Component, Input, OnInit} from '@angular/core';

import { Movie } from '../../models/movie.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MoviesService } from 'src/app/services/movies.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-movie-list',
    styleUrls: ['./movie-list.component.css'],
    templateUrl: './movie-list.component.html'
})

export class MovieListComponent implements OnInit {
    movies: Movie[] = [];
    cityId: string;
    cityName: string;
    moviesSub: Subscription;
    
    constructor(public moviesService: MoviesService, public route: ActivatedRoute){}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('cityId')){
                this.cityId = paramMap.get('cityId');
                this.moviesService.getMovies(this.cityId);
                this.moviesSub = this.moviesService.getMoviesUpdateListener()
                .subscribe((moviesData:{movies: Movie[]}) => {
                    this.movies = moviesData.movies;
                  });
            }
            
            
        });
    }

}