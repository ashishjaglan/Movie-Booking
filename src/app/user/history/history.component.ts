import { Component } from '@angular/core';
import { History } from 'src/app/models/history.model';
import { Subscription } from 'rxjs';
import { HistoryService } from 'src/app/services/history.service';
import { BookingsService } from 'src/app/services/bookings.service';

@Component({
    selector: 'app-history',
    styleUrls: ['./history.component.css'],
    templateUrl: './history.component.html'
})

export class HistoryComponent{
    isLoading = false;
    history: History[] = [];
    activeBookings = true;
    private historySub: Subscription;

    constructor(public historyService: HistoryService, public bookingService: BookingsService) {}

    ngOnInit() {
        this.loadHistory();
      }
    
    loadHistory(){
      this.isLoading = true;
      this.historyService.getBookingHistory(this.activeBookings);
      this.historySub = this.historyService.getBookingsHistoryUpdateListener()
      .subscribe((history: History[]) => {
        this.history = history;
        this.isLoading = false;
      });
    }

    reloadHistory(type: string){
      this.isLoading = true;
      if(type == 'active'){
        this.activeBookings = true;
      }else{
        this.activeBookings = false;
      }      
      this.historyService.getBookingHistory(this.activeBookings);
      this.historySub = this.historyService.getBookingsHistoryUpdateListener()
      .subscribe((history: History[]) => {
        this.history = history;
        this.isLoading = false;
      });
    }

    cancelBooking(historyId, bookingId){
      this.bookingService.makePayment(bookingId, "cancelled");
      this.isLoading = true;
      this.historyService.deleteEntry(historyId).subscribe(() => {
        this.historyService.getBookingHistory(this.activeBookings);
        });
    }
}