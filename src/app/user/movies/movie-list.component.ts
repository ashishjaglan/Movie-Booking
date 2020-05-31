import { Component, Input, OnInit} from '@angular/core';

import { Movie } from '../../models/movie.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MoviesService } from 'src/app/services/movies.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-movie-list',
    styleUrls: ['./movie-list.component.css'],
    templateUrl: './movie-list.component.html'
})

export class MovieListComponent implements OnInit {
    movies: Movie[] = [];
    isLoading = false;
    cityId: string;
    cityName: string;
    moviesSub: Subscription;
    totalMovies = 0;
    moviesPerPage = 2;
    currentPage=1;
    pagesSizeOptions = [1,2,5,10];
    
    constructor(public moviesService: MoviesService, public route: ActivatedRoute){}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('cityId')){
                this.cityId = paramMap.get('cityId');
                this.isLoading = true;
                this.moviesService.getMovies(this.cityId, this.moviesPerPage, this.currentPage);
                this.moviesSub = this.moviesService.getMoviesUpdateListener()
                .subscribe((moviesData:{movies: Movie[], movieCount: number}) => {
                    this.isLoading = false;
                    this.movies = moviesData.movies;
                    this.totalMovies = moviesData.movieCount;
                  });
            }
            
            
        });
    }

    onChangedPage(pageData: PageEvent){
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.moviesPerPage = pageData.pageSize;
        this.moviesService.getMovies(this.cityId, this.moviesPerPage, this.currentPage);
    }

}