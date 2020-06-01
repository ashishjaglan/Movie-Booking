import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from 'src/app/services/events.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-event-create',
    styleUrls: ['./event-create.component.css'],
    templateUrl: './event-create.component.html'
})

export class EventCreateComponent implements OnInit {
    form: FormGroup;

    constructor(public eventsService: EventsService, public route: ActivatedRoute){}


    ngOnInit(){
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
    

}