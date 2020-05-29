import { Component } from '@angular/core';
import { HallsService } from 'src/app/services/halls.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Hall } from 'src/app/models/hall.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShowsService } from 'src/app/services/shows.service';

@Component({
    selector: 'app-hall-show',
    styleUrls: ['./hall-show.component.css'],
    templateUrl: './hall-show.component.html'
})
export class HallShowComponent{
    hallId: string;
    hall: Hall;
    rows: string[];
    cols: string[];
    form: FormGroup;

    constructor(public hallsService: HallsService, public showsService: ShowsService, 
        public route: ActivatedRoute, public router: Router) {}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('hallId')){
                this.hallId = paramMap.get('hallId');
                this.hallsService.getHall(this.hallId).subscribe(hallData => {
                    this.hall = {
                        id: hallData._id,
                        name: hallData.name,
                        theatreId: hallData.theatreId,
                        rows: hallData.rows,
                        cols: hallData.cols
                    };
                });
            }                      
        });

        this.form = new FormGroup({
            sourceId: new FormControl(null, {validators: [Validators.required] }),
            date: new FormControl(null, {validators: [Validators.required] }),
            startTime: new FormControl(null, {validators: [Validators.required] }),
            endTime: new FormControl(null, {validators: [Validators.required] }),
            price: new FormControl(null, {validators: [Validators.required] })            
        });


    }

    addShow(){
        this.showsService.addShow(this.form.value.sourceId, this.hall.theatreId, this.hallId, this.form.value.date, 
            this.form.value.startTime, this.form.value.endTime, this.form.value.price, this.hall.rows, this.hall.cols);
    }

    
}