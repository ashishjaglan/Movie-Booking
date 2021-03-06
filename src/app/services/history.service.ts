import { Injectable } from '@angular/core';
import { History } from '../models/history.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserAuthService } from './userAuth.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class HistoryService{
    userId: string;
    private history: History[] = [];
    private historyUpdated = new Subject<{}>();

    constructor(private http: HttpClient, private userAuthService: UserAuthService, private router: Router) {}

    getBookingHistory(activeBookings: boolean){
        this.userId = this.userAuthService.getUserId();
        const queryParams = `?active=${activeBookings}`;
        this.http.get<{message: string, histories: any}>('http://localhost:3000/api/history/' + this.userId + queryParams)
        .pipe(map((historyData) => {
            return historyData.histories.map(historyItem => {
                return {
                    id: historyItem._id,
                    bookingId: historyItem.bookingId,
                    userId: historyItem.userId,
                    sourceName: historyItem.sourceName,
                    imagePath: historyItem.imagePath,
                    startTime: new Date(historyItem.startTime),
                    theatreName: historyItem.theatreName,
                    hallName: historyItem.hallName,
                    bookedSeats: historyItem.bookedSeats,
                    totalPayment: historyItem.totalPayment,
                    timeStamp: historyItem.timeStamp
                };
            })
        }))
        .subscribe((transformedHistory) => {
            this.history = transformedHistory;
            this.historyUpdated.next([...this.history]);
        });
    }

    getBookingsHistoryUpdateListener(){
        return this.historyUpdated.asObservable();
    }

    addBookingToHistory(bookingId: string){
        this.userId = this.userAuthService.getUserId();
        this.http
            .post<{ message: string}>('http://localhost:3000/api/history', {bookingId: bookingId, userId: this.userId})
            .subscribe((responseData) => {
                this.router.navigate(["/movies"]);
            });
    }

    deleteEntry(historyId: string){
        return this.http.delete('http://localhost:3000/api/history/' + historyId);
    }
}