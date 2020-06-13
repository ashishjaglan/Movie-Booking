import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Theatre } from '../models/theatre.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManagerAuthService } from './managerAuth.service';

@Injectable({providedIn: 'root'})
export class TheatresService{
    private theatres: Theatre[] = [];
    private theatresUpdated = new Subject<{}>();


    constructor(private http: HttpClient, private router: Router, private managerAuthService: ManagerAuthService) {}

    getTheatres(){
        const managerCityId = this.managerAuthService.getManagerCityId();
        this.http.get<{message: string, theatres: any}>('http://localhost:3000/api/theatre/' + managerCityId)
        .pipe(map((theatreData) => {
            return theatreData.theatres.map(theatre => {
                return {
                    name: theatre.name,
                    id: theatre._id,
                    cityId: theatre.cityId
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
        const managerCityId = this.managerAuthService.getManagerCityId();
        const theatre: Theatre = { id: null, cityId: managerCityId, name: name };
        this.http
            .post<{ message: string}>('http://localhost:3000/api/theatre', theatre)
            .subscribe((responseData) => {
                location.reload();
            });
        
    }
}