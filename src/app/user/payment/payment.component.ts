import { Component, OnInit } from '@angular/core';
import { BookingsService } from 'src/app/services/bookings.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HistoryService } from 'src/app/services/history.service';

@Component({
    selector: 'app-booking-payment',
    styleUrls: ['./payment.component.css'],
    templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit{
    private bookingId: string;
    booking = null;
    isLoading = false;
    isTimeLeft = true;
    bookingDeadlineTime: Date ;
    timeLeft: number = 600;

    constructor(public bookingService: BookingsService, private historyService: HistoryService, public route: ActivatedRoute, public router: Router) {}

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

    finishPaymentWindow(event) {
        if (event.action == "done"){
            this.isTimeLeft = false;
            this.router.navigate(["/"]);
        }
    }

    makePayment() {
        if(this.isTimeLeft == true){
            this.bookingService.makePayment(this.booking.id, "success");
            this.historyService.addBookingToHistory(this.bookingId);
            this.router.navigate(["/history"]);
        }
    }

    cancelBooking(){
        if(this.isTimeLeft == true){
            this.bookingService.makePayment(this.booking.id, "cancelled");
            this.router.navigate(["/"]);
        }
    }
}