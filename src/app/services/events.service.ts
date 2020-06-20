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
    private managerEvents: Event[] =[];
    private eventsUpdated = new Subject<{events: Event[], eventCount: number}>();
    private managerEventsUpdated = new Subject<{}>();

    constructor(private http: HttpClient, private router: Router, private managerAuthService: ManagerAuthService) {}

    getEvents(cityId, eventsPerPage: number, currentPage: number){
        this.cityId = localStorage.getItem('cityId');
        const queryParams = `?pagesize=${eventsPerPage}&page=${currentPage}`;
        this.http.get<{message: string, events: any, maxEvents: number}>('http://localhost:3000/api/event/' + cityId + queryParams)
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

    getEvent(eventId: string){
        return this.http.get<{
            _id: string;
            cityId: string;
            name: string;
            language: string;
            description: string;
            duration: string;
            imagePath: string;
            timestamp: Date
        }>( 'http://localhost:3000/api/event/data/' + eventId)
    }

    getEventsForManager() {
        const managerCityId = this.managerAuthService.getManagerCityId();
        this.http.get<{message: string, events: any}>('http://localhost:3000/api/event/manager/' + managerCityId)
        .pipe(map((eventData) => {            
            return {
                events: eventData.events.map(event => {
                return {
                    id: event._id,
                    cityId: null,
                    name: event.name,
                    language: null,
                    description: null,
                    duration: event.duration,
                    imagePath: null,
                    timestamp: null
                };
            })
        };
        }))
        .subscribe((transformedEventsData) => {
            this.managerEvents = transformedEventsData.events;
            this.managerEventsUpdated.next([...this.managerEvents]);
        });
    }

    getManagerEventsUpdateListener(){
        return this.managerEventsUpdated.asObservable();
    }


    addEvent(name: string, imagePath: string, language: string, duration: string, description: string){
        const managerCityId = this.managerAuthService.getManagerCityId();
        const event: Event = { id: null, cityId: managerCityId, name: name, language: language,
            description: description, duration: duration, imagePath: imagePath, timestamp: new Date() };
        this.http
            .post<{ message: string}>('http://localhost:3000/api/event', event)
            .subscribe((responseData) => {
                location.reload();
            });
        
    }

}