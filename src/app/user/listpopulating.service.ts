import { Injectable } from '@angular/core';
import { City } from '../models/city.model';
import { Movie } from '../models/movie.model';
import { Show } from '../models/show.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class ListPopulatingService{
    cities: City[] = [];
    

    shows: Show[] = [];
    //     {   id: "32344",
    //         sourceId: "82388",
    //         theatreName: "PVR",
    //         auditoriumId: "345dsb",
    //         startTime: new Date(),
    //         endTime: new Date(),
    //         price: 300,
    //         seatsAvailable: 10,
    //         seats: [ [0,0,1,0,1], [0,0,1,0,1] ]
    //     },

    //     {   id: "32344",
    //         sourceId: "82388",
    //         theatreName: "Cinemos",
    //         auditoriumId: "345dsb",
    //         startTime: new Date(),
    //         endTime: new Date(),
    //         price: 300,
    //         seatsAvailable: 10,
    //         seats: [ [0,0,1,0,1], [0,0,1,0,1] ]
    //     }
    // ];

    private cityId: string;
    private sourceId: string;
    //private cityIdUpdate = new Subject<{updatedCityId: string}>();
    private citiesUpdated = new Subject<{}>();

    constructor(private http: HttpClient) {}
    

    // getCities(){
    //     this.http.get<{message: string, cities: City[]}>('http://localhost:3000/api')
    //     .subscribe((cityData) => {
    //         this.cities = cityData.cities;
    //         this.citiesUpdated.next([...this.cities]);
    //     });
    // }

    // getCitiesUpdateListener(){
    //     return this.citiesUpdated.asObservable();
    // }

    // getMovies(cityId: string){
    //     console.log(cityId); 
    //     this.cityId = cityId; 
    //     this.cityIdUpdate.next({updatedCityId: this.cityId});      
    //     return this.movies;
    // }

    getShows(sourceId: string){
        console.log(sourceId);   
        this.sourceId = sourceId;     
        return this.shows;
    }

    // getCityIdUpdate(){
    //     return this.cityIdUpdate.asObservable();
    // }

}