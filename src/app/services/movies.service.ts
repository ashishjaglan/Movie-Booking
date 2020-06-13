import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ManagerAuthService } from './managerAuth.service';


@Injectable({providedIn: 'root'})
export class MoviesService{

    private cityId: string;
    private movies: Movie[] =[];
    private moviesUpdated = new Subject<{movies: Movie[], movieCount: number}>();

    constructor(private http: HttpClient, private router: Router, private managerAuthService: ManagerAuthService) {}

    getMovies(moviesPerPage: number, currentPage: number){
        this.cityId = localStorage.getItem('cityId');
        const queryParams = `?pagesize=${moviesPerPage}&page=${currentPage}`;
        this.http.get<{message: string, movies: any, maxMovies: number}>('http://localhost:3000/api/movie/' + this.cityId + queryParams)
        .pipe(map((movieData) => {            
            return {
            movies: movieData.movies.map(movie => {
                return {
                    id: movie._id,
                    cityId: null,
                    name: movie.name,
                    language: movie.language,
                    description: null,
                    duration: null,
                    imagePath: movie.imagePath,
                    timestamp: null
                };
            }),
            maxMovies: movieData.maxMovies
        };
        }))
        .subscribe((transformedMoviesData) => {
            this.movies = transformedMoviesData.movies;
            this.moviesUpdated.next({movies: [...this.movies],
                movieCount: transformedMoviesData.maxMovies});
        });
    }

    getMoviesUpdateListener(){
        return this.moviesUpdated.asObservable();
    }


    //{"_id":{"$oid":"5ecbecaf88b09661c46201b9"},"name":"Delhi","__v":{"$numberInt":"0"}}
    //{"_id":{"$oid":"5ecbefdcea3f0f7e4cca92bc"},"name":"Bangalore","__v":{"$numberInt":"0"}}

    addMovie(name: string, imagePath: string, language: string, duration: string, description: string){
        const managerCityId = this.managerAuthService.getManagerCityId();
        const movie: Movie = { id: null, cityId: managerCityId, name: name, language: language,
            description: description, duration: duration, imagePath: imagePath, timestamp: new Date() };
        this.http
            .post<{ message: string}>('http://localhost:3000/api/movie', movie)
            .subscribe((responseData) => {
                console.log(responseData);                
                //this.router.navigate(["/"]);
            });
        
    }

}