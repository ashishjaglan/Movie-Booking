import { Component } from '@angular/core';
import { History } from 'src/app/models/history.model';
import { Subscription } from 'rxjs';
import { HistoryService } from 'src/app/services/history.service';

@Component({
    selector: 'app-history',
    styleUrls: ['./history.component.css'],
    templateUrl: './history.component.html'
})

export class HistoryComponent{
    isLoading = false;
    history: History[] = [];
    private historySub: Subscription;

    constructor(public historyService: HistoryService) {}

    ngOnInit() {
        this.isLoading = true;
        this.historyService.getBookingHistory();
        this.historySub = this.historyService.getBookingsHistoryUpdateListener()
        .subscribe((history: History[]) => {
          this.isLoading = false;
          this.history = history;
        });
      }
}