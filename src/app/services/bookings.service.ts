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
        const booking: Booking = { id: null, showId: showId, userId: this.userId, bookedSeats: bookedSeats, totalPayment: totalPayment };
        this.http
            .post<{ message: string}>('http://localhost:3000/api/booking', booking)
            .subscribe((responseData) => {
                console.log(responseData);                
                location.reload();
            });
    }
}