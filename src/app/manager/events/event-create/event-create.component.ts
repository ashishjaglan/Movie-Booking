import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from 'src/app/services/events.service';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/models/event.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-event-create',
    styleUrls: ['./event-create.component.css'],
    templateUrl: './event-create.component.html'
})

export class EventCreateComponent implements OnInit {
    form: FormGroup;
    managerCityId: string;
    events: Event[] = [];
    isLoading = false;
    eventsSub: Subscription;
    totalEvents = 0;
    eventsPerPage = 6;
    currentPage=1;
    pagesSizeOptions = [6,12,24];

    constructor(public eventsService: EventsService, public route: ActivatedRoute){}


    ngOnInit(){
        this.managerCityId = localStorage.getItem('managerCityId');
        this.isLoading = true;
        this.eventsService.getEvents(this.managerCityId, this.eventsPerPage, this.currentPage);
        this.eventsSub = this.eventsService.getEventsUpdateListener()
        .subscribe((eventsData:{events: Event[], eventCount: number}) => {
            this.isLoading = false;
            this.events = eventsData.events;
            this.totalEvents = eventsData.eventCount;
            });

        this.form = new FormGroup({
            name: new FormControl(null, {validators: [Validators.required] }),
            imagePath: new FormControl(null, {validators: [Validators.required] }),
            language: new FormControl(null, {validators: [Validators.required] }),
            duration: new FormControl(null, {validators: [Validators.required] }),
            description: new FormControl(null, {validators: [Validators.required] }),
            
        });
    }


    addEvent() {
        if (this.form.valid) {
          this.eventsService.addEvent(this.form.value.name, this.form.value.imagePath, this.form.value.language, 
            this.form.value.duration, this.form.value.description);
        }
    }
    
    onChangedPage(pageData: PageEvent){
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.eventsPerPage = pageData.pageSize;
        this.eventsService.getEvents(this.managerCityId, this.eventsPerPage, this.currentPage);
    }

}