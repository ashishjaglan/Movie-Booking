import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Theatre } from '../models/theatre.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class TheatresService{
    private cityId: string = "5ecbefdcea3f0f7e4cca92bc";
    private theatres: Theatre[] = [];
    private theatresUpdated = new Subject<{}>();


    constructor(private http: HttpClient, private router: Router) {}

    getCities(){
        this.http.get<{message: string, theatres: any}>('http://localhost:3000/api/theatre/' + this.cityId)
        .pipe(map((theatreData) => {
            return theatreData.theatres.map(theatre => {
                return {
                    name: theatre.name,
                    id: theatre._id,
                    cityId: this.cityId
                };
            })
        }))
        .subscribe((transformedTheatres) => {
            this.theatres = transformedTheatres;
            this.theatresUpdated.next([...this.theatres]);
        });
    }

    getTheatresUpdateListener(){
        return this.theatresUpdated.asObservable();
    }

    addTheatre(name: string){
        const theatre: Theatre = { id: null, cityId: this.cityId, name: name };
        this.http
            .post<{ message: string}>('http://localhost:3000/api/theatre', theatre)
            .subscribe((responseData) => {
                console.log(responseData);                
                //this.router.navigate(["/"]);
            });
        
    }
}