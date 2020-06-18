import { Injectable } from '@angular/core';
import { Show } from '../models/show.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HallScheduleItem } from '../models/hallScheduleItem.model';

@Injectable({providedIn: 'root'})
export class ShowsService{
    private shows: Show[] = [];
    private schedule: HallScheduleItem[] = [];
    private showsUpdated = new Subject<{}>();
    private scheduleUpdated = new Subject<{}>();

    constructor(private http: HttpClient, private router: Router) {}

    getShows(sourceId: string){
        this.http.get<{message: string, shows: any}>('http://localhost:3000/api/show/' + sourceId)
        .pipe(map((showData) => {
            return showData.shows.map(show => {
                return {
                    id: show._id,
                    sourceId: null,
                    isMovie: null,
                    theatreData: show.theatreName,
                    hallId: null,
                    startTime: new Date(show.startTime),
                    endTime: null,
                    price: null,
                    seatsAvailable: show.seatsAvailable,
                    seats: null,
                    cols: null
                };
            })
        }))
        .subscribe((transformedShows) => {
            this.shows = transformedShows;
            this.showsUpdated.next([...this.shows]);
        });
    }

    getShowsUpdateListener(){
        return this.showsUpdated.asObservable();
    }

    getShow(showId: string){
        return this.http.get<{
            _id: string;
            sourceId: string;
            isMovie: boolean;
            theatreData: string;
            hallId: string;
            startTime: Date;
            endTime: Date;
            price: number;
            seatsAvailable: number;
            seats: number[];
            cols: number;
        }>( 'http://localhost:3000/api/show/data/' + showId)
    }

    getHallSchedule(hallId: string, date: Date){
        const queryParams = `?date=${date}`;
        this.http.get<{message: string, schedule: any}>('http://localhost:3000/api/show/schedule/' + hallId + queryParams)
        .pipe(map((scheduleData) => {
            return scheduleData.schedule.map(schedule => {
                return {
                    id: schedule._id,
                    sourceId: schedule.sourceId,
                    startTime: new Date(schedule.startTime),
                    endTime: new Date(schedule.endTime)
                };
            })
        }))
        .subscribe((transformedScheduleData) => {
            //console.log(scheduleData);
            this.schedule = transformedScheduleData;
            this.scheduleUpdated.next([...this.schedule]);
        });
    }

    gettHallScheduleUpdateListener(){
        return this.scheduleUpdated.asObservable();
    }

    addShow(sourceId: string, isMovie: boolean, theatreId: string, hallId: string, date: Date, startTime: Date, 
        endTime: Date, price: string, seats: number[], cols: number){
            
        const show: Show = { id: null, sourceId: sourceId, isMovie: isMovie, theatreData: theatreId, hallId: hallId, 
            startTime: startTime, endTime: endTime, price: parseInt(price), seatsAvailable: (seats.length), 
            seats: seats, cols: cols};
        
            
        return this.http
            .post<{ message: string}>('http://localhost:3000/api/show', show);
        
    }
}