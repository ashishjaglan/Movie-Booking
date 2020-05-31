import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class MoviesService{

    private cityId: string;
    private cityIdUpdate = new Subject<{updatedCityId: string}>();
    private movies: Movie[] =[];
    private moviesUpdated = new Subject<{movies: Movie[], movieCount: number}>();


    constructor(private http: HttpClient, private router: Router) {}

    getMovies(cityId: string, moviesPerPage: number, currentPage: number){
        this.cityId = cityId;
        this.cityIdUpdate.next({updatedCityId: this.cityId}); 
        const queryParams = `?pagesize=${moviesPerPage}&page=${currentPage}`;
        this.http.get<{message: string, movies: any, maxMovies: number}>('http://localhost:3000/api/movie/' + cityId + queryParams)
        .pipe(map((movieData) => {
            return {
            movies: movieData.movies.map(movie => {
                return {
                    id: movie._id,
                    cityId: movie.cityId,
                    name: movie.name,
                    language: movie.language,
                    description: movie.description,
                    duration: movie.duration,
                    imagePath: movie.imagePath
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

    getCityIdUpdate(){
        return this.cityIdUpdate.asObservable();
    }

    //{"_id":{"$oid":"5ecbecaf88b09661c46201b9"},"name":"Delhi","__v":{"$numberInt":"0"}}
    //{"_id":{"$oid":"5ecbefdcea3f0f7e4cca92bc"},"name":"Bangalore","__v":{"$numberInt":"0"}}

    addMovie(name: string, imagePath: string, language: string, duration: string, description: string){
        const movieData = new FormData();
        movieData.append("name", name);
        movieData.append("imagePath", imagePath);
        movieData.append("language", language);
        movieData.append("duration", duration);
        movieData.append("description", description);
        const movie: Movie = { id: null, cityId: "5ecbefdcea3f0f7e4cca92bc", name: name, language: language,
            description: description, duration: duration, imagePath: imagePath };
        this.http
            .post<{ message: string}>('http://localhost:3000/api/movie', movie)
            .subscribe((responseData) => {
                console.log(responseData);                
                //this.router.navigate(["/"]);
            });
        
    }

}