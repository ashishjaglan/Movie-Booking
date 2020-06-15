import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MoviesService } from 'src/app/services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Movie } from 'src/app/models/movie.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-movie-create',
    styleUrls: ['./movie-create.component.css'],
    templateUrl: './movie-create.component.html'
})

export class MovieCreateComponent implements OnInit {
    form: FormGroup;
    managerCityId: string;
    movies: Movie[] = [];
    isLoading = false;
    moviesSub: Subscription;
    totalMovies = 0;
    moviesPerPage = 4;
    currentPage=1;
    pagesSizeOptions = [4,8,12,16];

    constructor(private moviesService: MoviesService, private route: ActivatedRoute){}


    ngOnInit(){
        this.managerCityId = localStorage.getItem('managerCityId');
        this.isLoading = true;
        this.moviesService.getMovies(this.managerCityId, this.moviesPerPage, this.currentPage);
        this.moviesSub = this.moviesService.getMoviesUpdateListener()
        .subscribe((moviesData:{movies: Movie[], movieCount: number}) => {
            this.isLoading = false;
            this.movies = moviesData.movies;
            this.totalMovies = moviesData.movieCount;
            });
            
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
    
    onChangedPage(pageData: PageEvent){
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.moviesPerPage = pageData.pageSize;
        this.moviesService.getMovies(this.managerCityId, this.moviesPerPage, this.currentPage);
    }

}