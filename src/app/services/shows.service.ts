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
                    sourceId: show.sourceId,
                    theatreData: show.theatreName,
                    hallId: show.hallId,
                    date: show.date,
                    startTime: show.startTime,
                    endTime: show.endTime,
                    price: show.price,
                    seatsAvailable: show.seatsAvailable,
                    rows: show.rows,
                    cols: show.cols,
                    reservedSeats: show.reservedSeats,
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
            theatreData: string;
            hallId: string;
            date: string;
            startTime: string;
            endTime: string;
            price: number;
            seatsAvailable: number;
            rows: string[];
            cols: string[];
            reservedSeats: string[];
        }>( 'http://localhost:3000/api/show/data/' + showId)
    }

    addShow(sourceId: string, theatreId: string, hallId: string, date: Date, startTime: string, 
        endTime: string, price: string, rows: string[], cols: string[]){
        
            var month = date.getUTCMonth() + 1; //months from 1-12
            var day = date.getDate();
            var year = date.getUTCFullYear();
            
            var showdate = day + "/" + month + "/" + year;
        const show: Show = { id: null, sourceId: sourceId, theatreData: theatreId, hallId: hallId, date: showdate,
            startTime: startTime, endTime: endTime, price: parseInt(price), seatsAvailable: (rows.length * cols.length), 
            rows: rows, cols: cols, reservedSeats: null };
            
        this.http
            .post<{ message: string}>('http://localhost:3000/api/show', show)
            .subscribe((responseData) => {
                console.log(responseData);                
                //this.router.navigate(["/"]);
            });
        
    }
}