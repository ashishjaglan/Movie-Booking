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
    private managerMovies: Movie[] =[];
    private moviesUpdated = new Subject<{movies: Movie[], movieCount: number}>();
    private managerMoviesUpdated = new Subject<{}>();

    constructor(private http: HttpClient, private router: Router, private managerAuthService: ManagerAuthService) {}

    getMovies(cityId: string, moviesPerPage: number, currentPage: number){
        this.cityId = localStorage.getItem('cityId');
        const queryParams = `?pagesize=${moviesPerPage}&page=${currentPage}`;
        this.http.get<{message: string, movies: any, maxMovies: number}>('http://localhost:3000/api/movie/' + cityId + queryParams)
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

    getMovie(movieId: string){
        return this.http.get<{
            _id: string;
            cityId: string;
            name: string;
            language: string;
            description: string;
            duration: string;
            imagePath: string;
            timestamp: Date
        }>( 'http://localhost:3000/api/movie/data/' + movieId)
    }

    getMoviesForManager() {
        const managerCityId = this.managerAuthService.getManagerCityId();
        this.http.get<{message: string, movies: any}>('http://localhost:3000/api/movie/manager/' + managerCityId)
        .pipe(map((movieData) => {            
            return {
            movies: movieData.movies.map(movie => {
                return {
                    id: movie._id,
                    cityId: null,
                    name: movie.name,
                    language: null,
                    description: null,
                    duration: movie.duration,
                    imagePath: null,
                    timestamp: null
                };
            })
        };
        }))
        .subscribe((transformedMoviesData) => {
            this.managerMovies = transformedMoviesData.movies;
            this.managerMoviesUpdated.next([...this.managerMovies]);
        });
    }

    getManagerMoviesUpdateListener(){
        return this.managerMoviesUpdated.asObservable();
    }


    addMovie(isURL: boolean, name: string, image: any, language: string, duration: string, description: string){
        const managerCityId = this.managerAuthService.getManagerCityId();
        if(isURL == true){
            const movie: Movie = { id: null, cityId: managerCityId, name: name, language: language,
                description: description, duration: duration, imagePath: image, timestamp: new Date() };
                console.log(movie);
                
            this.http
                .post<{ message: string}>('http://localhost:3000/api/movie', movie)
                .subscribe((responseData) => {
                    location.reload();
                });
        }else{
            const movieData = new FormData();
            movieData.append("cityId", managerCityId);
            movieData.append("name", name);
            movieData.append("language", language);
            movieData.append("description", description);
            movieData.append("duration", duration);
            movieData.append("imagePath", image, name);
            this.http
                .post<{ message: string }>('http://localhost:3000/api/movie/imageUpload', movieData)
                .subscribe((responseData) => {
                    location.reload();
                });
        }
        
    }

}