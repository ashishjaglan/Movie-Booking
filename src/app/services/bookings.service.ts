import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserAuthService } from './userAuth.service';

@Injectable({providedIn: 'root'})
export class BookingsService{
    userId: string;

    constructor(private http: HttpClient, private userAuthService: UserAuthService, private router: Router) {}

    addBooking(showId: string, totalPayment: number, bookedSeats: number[]){
        this.userId = this.userAuthService.getUserId();
        const booking: Booking = { id: null, showId: showId, userId: this.userId, bookedSeats: bookedSeats, totalPayment: totalPayment, timeStamp: null };
        this.http
            .post<{ message: string, bookingId: string}>('http://localhost:3000/api/booking', booking)
            .subscribe((responseData) => {
                this.router.navigate(["/payment/" + responseData.bookingId]);
            });

    }

    getBooking(bookingId: string){
        return this.http.get<{
            _id: string;
            showId: string;
            userId: string;
            status: string;
            bookedSeats: number[];
            totalPayment: number;
            timeStamp: Date;
        }>( 'http://localhost:3000/api/booking/' + bookingId)
    }

    makePayment(bookingId: string, status: string){
        this.http.patch<{ message: string }>( 'http://localhost:3000/api/booking/' + bookingId, {status} )
        .subscribe((response) => {
            console.log(response);
            
        });
    }
}