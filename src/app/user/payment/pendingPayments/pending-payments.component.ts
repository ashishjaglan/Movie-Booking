import { Component, OnInit } from '@angular/core';
import { Show } from 'src/app/models/show.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ShowsService } from 'src/app/services/shows.service';
import { Subscription } from 'rxjs';
import { PendingPayment } from 'src/app/models/pendingPayment.model';
import { BookingsService } from 'src/app/services/bookings.service';

@Component({
    selector: 'app-pending-payments',
    styleUrls: ['./pending-payments.component.css'],
    templateUrl: './pending-payments.component.html'
})

export class PendingPaymentsComponent implements OnInit{
    isLoading = false;
    sourceId: string;
    pendingPayments: PendingPayment[] = [];
    pendingPaymentsSub: Subscription;

    constructor(public bookingServie: BookingsService, public route: ActivatedRoute, public router: Router) {}

    ngOnInit(){  
        this.isLoading = true;
        this.bookingServie.getPendingPayments();
        this.pendingPaymentsSub = this.bookingServie.getpendingPaymentsUpdateListener()
        .subscribe((pendingPayments: PendingPayment[]) => {
            this.isLoading = false;
          this.pendingPayments = pendingPayments;
        });
    }

    gotoPaymentWindow(paymentId){
        this.router.navigate(["/payment/"+ paymentId]);
    }
}