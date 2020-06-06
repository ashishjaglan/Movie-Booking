import { Component, OnInit} from '@angular/core';

import { Event } from '../../models/event.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-event-list',
    styleUrls: ['./event-list.component.css'],
    templateUrl: './event-list.component.html'
})

export class EventListComponent implements OnInit {
    events: Event[] = [];
    isLoading = false;
    cityId: string;
    cityName: string;
    eventsSub: Subscription;
    totalEvents = 0;
    eventsPerPage = 4;
    currentPage=1;
    pagesSizeOptions = [4,8,12,16];
    
    constructor(public eventsService: EventsService, public route: ActivatedRoute, public router: Router){}

    ngOnInit(){
        this.cityId = localStorage.getItem('cityId');
        if(this.cityId!=null){
            this.isLoading = true;
                this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
                this.eventsSub = this.eventsService.getEventsUpdateListener()
                .subscribe((eventsData:{events: Event[], eventCount: number}) => {
                    this.isLoading = false;
                    this.events = eventsData.events;
                    this.totalEvents = eventsData.eventCount;
                  });
        }else{
            this.router.navigate(["/"]);
        }
     }

    onChangedPage(pageData: PageEvent){
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.eventsPerPage = pageData.pageSize;
        this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
    }

}