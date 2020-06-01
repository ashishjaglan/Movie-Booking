import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class EventsService{

    private cityId: string;
    private cityIdUpdate = new Subject<{updatedCityId: string}>();
    private events: Event[] =[];
    private eventsUpdated = new Subject<{events: Event[], eventCount: number}>();


    constructor(private http: HttpClient, private router: Router) {}

    getEvents(cityId: string, eventsPerPage: number, currentPage: number){
        this.cityId = cityId;
        this.cityIdUpdate.next({updatedCityId: this.cityId}); 
        const queryParams = `?pagesize=${eventsPerPage}&page=${currentPage}`;
        this.http.get<{message: string, events: any, maxEvents: number}>('http://localhost:3000/api/event/' + cityId + queryParams)
        .pipe(map((eventData) => {
            return {
            events: eventData.events.map(event => {
                return {
                    id: event._id,
                    cityId: event.cityId,
                    name: event.name,
                    language: event.language,
                    description: event.description,
                    duration: event.duration,
                    imagePath: event.imagePath
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

    getCityIdUpdate(){
        return this.cityIdUpdate.asObservable();
    }

    //{"_id":{"$oid":"5ecbecaf88b09661c46201b9"},"name":"Delhi","__v":{"$numberInt":"0"}}
    //{"_id":{"$oid":"5ecbefdcea3f0f7e4cca92bc"},"name":"Bangalore","__v":{"$numberInt":"0"}}

    addEvent(name: string, imagePath: string, language: string, duration: string, description: string){
        const eventData = new FormData();
        eventData.append("name", name);
        eventData.append("imagePath", imagePath);
        eventData.append("language", language);
        eventData.append("duration", duration);
        eventData.append("description", description);
        const event: Event = { id: null, cityId: "5ecbecaf88b09661c46201b9", name: name, language: language,
            description: description, duration: duration, imagePath: imagePath };
        this.http
            .post<{ message: string}>('http://localhost:3000/api/event', event)
            .subscribe((responseData) => {
                console.log(responseData);                
                //this.router.navigate(["/"]);
            });
        
    }

}