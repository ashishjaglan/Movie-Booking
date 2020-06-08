import { Component, OnInit } from '@angular/core';
import { BookingsService } from 'src/app/services/bookings.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-booking-payment',
    styleUrls: ['./payment.component.css'],
    templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit{
    private bookingId: string;
    booking = null;
    isLoading = false;
    bookingDeadlineTime: Date ;
    timeLeft: number = 0;

    constructor(public bookingService: BookingsService, public route: ActivatedRoute) {}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('bookingId')){
                this.bookingId = paramMap.get('bookingId');
                this.isLoading = true;
                this.bookingService.getBooking(this.bookingId).subscribe(bookingData => {
                    this.booking = {
                        id: bookingData._id,
                        showId: bookingData.showId,
                        userId: bookingData.userId,
                        status: bookingData.status,
                        bookedSeats: bookingData.bookedSeats,
                        totalPayment: bookingData.totalPayment,
                        timeStamp: bookingData.timeStamp
                    };
                    this.bookingDeadlineTime = new Date(this.booking.timeStamp);
                    this.bookingDeadlineTime = new Date(this.bookingDeadlineTime.getTime() + 10*60*1000);
                    let timeNow = new Date();
                    if(this.bookingDeadlineTime<timeNow){
                        this.timeLeft=0;
                    }else{
                        this.timeLeft = Math.floor((this.bookingDeadlineTime.getTime() - new Date().getTime())/1000);
                    }
                });
                
            }        
        });
    }

    makePayment() {
        this.bookingService.makePayment(this.booking.id, "success");
    }

    cancelBooking(){
        this.bookingService.makePayment(this.booking.id, "cancelled");
    }
}