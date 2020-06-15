import { Component, OnInit} from '@angular/core';

import { Movie } from '../../models/movie.model';
import { ActivatedRoute, Router } from '@angular/router';
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
    moviesPerPage = 4;
    currentPage=1;
    pagesSizeOptions = [4,8,12,16];
    
    constructor(public moviesService: MoviesService, public route: ActivatedRoute, public router: Router){}

    ngOnInit(){
        this.cityId = localStorage.getItem('cityId');
        if(this.cityId!=null){
            this.isLoading = true;
                this.moviesService.getMovies(this.cityId, this.moviesPerPage, this.currentPage);
                this.moviesSub = this.moviesService.getMoviesUpdateListener()
                .subscribe((moviesData:{movies: Movie[], movieCount: number}) => {
                    this.isLoading = false;
                    this.movies = moviesData.movies;
                    this.totalMovies = moviesData.movieCount;
                  });
        }else{
            this.router.navigate(["/"]);
        }
    }

    onChangedPage(pageData: PageEvent){
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.moviesPerPage = pageData.pageSize;
        this.moviesService.getMovies(this.cityId, this.moviesPerPage, this.currentPage);
    }

}