import { Injectable } from '@angular/core';
import { Show } from '../models/show.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ShowsService{
    private shows: Show[] = [];
    private showsUpdated = new Subject<{}>();

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

    addShow(sourceId: string, isMovie: boolean, theatreId: string, hallId: string, date: Date, startTime: string, 
        endTime: string, price: string, seats: number[], cols: number){
            
            var startHour = startTime.split(':');
            var startMinute = startHour[1].split(' ');            
            var start = new Date(date);
            if(startHour[0]=='12'){
                if(startMinute[1]=='AM'){
                    start.setHours(0);
                }
                else start.setHours(12);
            }else{
                if(startMinute[1]=='PM'){
                    start.setHours(parseInt(startHour[0])+12);
                }
                else    start.setHours(parseInt(startHour[0]));
            }            
            start.setMinutes(parseInt(startMinute[0]));
            console.log(start);
            
            var endHour = endTime.split(':');
            var endMinute = endHour[1].split(' ');            
            var end = new Date(date);
            if(endHour[0]=='12'){
                if(endMinute[1]=='AM'){
                    end.setHours(0);
                }
                else end.setHours(12);
            }else{
                if(endMinute[1]=='PM'){
                    end.setHours(parseInt(endHour[0])+12);
                }
                else    end.setHours(parseInt(endHour[0]));
            }            
            end.setMinutes(parseInt(endMinute[0]));
            console.log(end);
            
        const show: Show = { id: null, sourceId: sourceId, isMovie: isMovie, theatreData: theatreId, hallId: hallId, 
            startTime: start, endTime: end, price: parseInt(price), seatsAvailable: (seats.length), 
            seats: seats, cols: cols};
            
        this.http
            .post<{ message: string}>('http://localhost:3000/api/show', show)
            .subscribe((responseData) => {
                console.log(responseData);                
                //this.router.navigate(["/"]);
            });
        
    }
}