import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { City } from '../models/city.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class CitiesService{
    private cities: City[] = [];
    private citiesUpdated = new Subject<{}>();

    constructor(private http: HttpClient, private router: Router) {}
    

    getCities(){
        this.http.get<{message: string, cities: any}>('http://localhost:3000/api/city')
        .pipe(map((cityData) => {
            return cityData.cities.map(city => {
                return {
                    name: city.name,
                    id: city._id
                };
            })
        }))
        .subscribe((transformedCities) => {
            this.cities = transformedCities;
            this.citiesUpdated.next([...this.cities]);
        });
    }

    getCitiesUpdateListener(){
        return this.citiesUpdated.asObservable();
    }

    addCity(cityName: string){
        const managerId = localStorage.getItem('managerId');
        cityName = cityName.toLocaleUpperCase();
        this.http
            .post<{ message: string}>('http://localhost:3000/api/city', {cityName, managerId} )
            .subscribe((responseData) => {
                console.log(responseData);                
                //this.router.navigate(["/"]);
            });
        
    }

}