import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ManagerAuthService } from './managerAuth.service';


@Injectable({providedIn: 'root'})
export class EventsService{

    private cityId: string;
    private events: Event[] =[];
    private eventsUpdated = new Subject<{events: Event[], eventCount: number}>();

    constructor(private http: HttpClient, private router: Router, private managerAuthService: ManagerAuthService) {}

    getEvents(eventsPerPage: number, currentPage: number){
        this.cityId = localStorage.getItem('cityId');
        const queryParams = `?pagesize=${eventsPerPage}&page=${currentPage}`;
        this.http.get<{message: string, events: any, maxEvents: number}>('http://localhost:3000/api/event/' + this.cityId + queryParams)
        .pipe(map((eventData) => {
            return {
            events: eventData.events.map(event => {
                return {
                    id: event._id,
                    cityId: null,
                    name: event.name,
                    language: event.language,
                    description: null,
                    duration: null,
                    imagePath: event.imagePath,
                    timestamp: null
                };
            }),
            maxEvents: eventData.maxEvents
        };
        }))
        .subscribe((transformedEventsData) => {
            this.events = transformedEventsData.events;
            this.eventsUpdated.next({events: [...this.events],
                eventCount: transformedEventsData.maxEvents});
        });
    }

    getEventsUpdateListener(){
        return this.eventsUpdated.asObservable();
    }


    //{"_id":{"$oid":"5ecbecaf88b09661c46201b9"},"name":"Delhi","__v":{"$numberInt":"0"}}
    //{"_id":{"$oid":"5ecbefdcea3f0f7e4cca92bc"},"name":"Bangalore","__v":{"$numberInt":"0"}}

    addEvent(name: string, imagePath: string, language: string, duration: string, description: string){
        const managerCityId = this.managerAuthService.getManagerCityId();
        const event: Event = { id: null, cityId: managerCityId, name: name, language: language,
            description: description, duration: duration, imagePath: imagePath, timestamp: new Date() };
        this.http
            .post<{ message: string}>('http://localhost:3000/api/event', event)
            .subscribe((responseData) => {
                console.log(responseData);                
                //this.router.navigate(["/"]);
            });
        
    }

}