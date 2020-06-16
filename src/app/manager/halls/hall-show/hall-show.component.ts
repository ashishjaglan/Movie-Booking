import { Component } from '@angular/core';
import { HallsService } from 'src/app/services/halls.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Hall } from 'src/app/models/hall.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShowsService } from 'src/app/services/shows.service';
import { MoviesService } from 'src/app/services/movies.service';
import { Subscription } from 'rxjs';
import { Movie } from 'src/app/models/movie.model';
import { Event } from 'src/app/models/event.model';
import { HallScheduleItem } from 'src/app/models/hallScheduleItem.model';
import { EventsService } from 'src/app/services/events.service';

@Component({
    selector: 'app-hall-show',
    styleUrls: ['./hall-show.component.css'],
    templateUrl: './hall-show.component.html'
})
export class HallShowComponent{
    hallId: string;
    isMovie: string = 'true';
    hall: Hall;
    form: FormGroup;
    scheduleForm: FormGroup;
    schedules: HallScheduleItem[] = [];
    rows: number;
    moviesSub: Subscription;
    eventsSub: Subscription;
    scheduleSub: Subscription;
    movies: Movie[] = [];
    events: Event[] = [];
    selectedValue: string;
    displayedColumns: string[] = ['sourceId', 'startTime', 'endTime'];
    alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
    rowsArray: string[];

    colsArray: string[] = ['1'];

    constructor(private hallsService: HallsService, private showsService: ShowsService, private moviesService: MoviesService,
        private evetsService: EventsService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('hallId')){
                this.hallId = paramMap.get('hallId');
                this.hallsService.getHall(this.hallId).subscribe(hallData => {
                    this.hall = {
                        id: hallData._id,
                        name: hallData.name,
                        theatreId: hallData.theatreId,
                        seats: hallData.seats,
                        cols: hallData.cols
                    };
                    this.seatLayout();
                });
            }                      
        });

        this.moviesService.getMoviesForManager();
        this.moviesSub = this.moviesService.getManagerMoviesUpdateListener()
            .subscribe((movies: Movie[]) => {
                this.movies = movies;
                });
        
        this.evetsService.getEventsForManager();
        this.eventsSub = this.evetsService.getManagerEventsUpdateListener()
            .subscribe((events: Event[]) => {
                this.events = events;
                });

        this.form = new FormGroup({
            movie: new FormControl(null),
            event: new FormControl(null),
            date: new FormControl(null, {validators: [Validators.required] }),
            startTime: new FormControl(null, {validators: [Validators.required] }),
            endTime: new FormControl(null, {validators: [Validators.required] }),
            price: new FormControl(null, {validators: [Validators.required] })            
        });

    }

    seatLayout(){
        this.rows = this.hall.seats.length / this.hall.cols;
        this.rowsArray = this.alphabet.slice(0,this.rows);

        for (let step = 2; step <= this.hall.cols; step++) {
            this.colsArray.push(step.toString());
        }

    }

    getSchedule(){
        this.showsService.getHallSchedule(this.hallId, this.form.value.date);
        this.scheduleSub = this.showsService.gettHallScheduleUpdateListener()
            .subscribe((schedule: HallScheduleItem[]) => {
                this.schedules = schedule;              
                });
    }

    addShow(){
        var startingTime = this.getDateObject(this.form.value.startTime);
        var endingTime = this.getDateObject(this.form.value.endTime);
        if(this.checkShowConflict(startingTime, endingTime) == true){
            console.log("Conflict");
        }else{
            this.showsService.addShow(this.isMovie == "true" ?this.form.value.movie.id : this.form.value.event.id, 
            this.isMovie == "true", this.hall.theatreId, this.hallId, this.form.value.date, 
            startingTime, endingTime, this.form.value.price, this.hall.seats, this.hall.cols);
        }        
        
    }

    checkShowConflict(startTime: Date, endTime: Date){
        for(var schedule of this.schedules){
            if((startTime<=schedule.startTime && endTime>=schedule.endTime) || (startTime>=schedule.startTime && startTime<schedule.endTime) || (endTime>schedule.startTime && endTime<=schedule.endTime)){
                return true;
            }
        }
        return false;
    }

    getDateObject(time: string){
        var hour = time.split(':');
            var minute = hour[1].split(' ');            
            var dateObject = new Date(this.form.value.date);
            if(hour[0]=='12'){
                if(minute[1]=='AM'){
                    dateObject.setHours(0);
                }
                else dateObject.setHours(12);
            }else{
                if(minute[1]=='PM'){
                    dateObject.setHours(parseInt(hour[0])+12);
                }
                else    dateObject.setHours(parseInt(hour[0]));
            }            
            dateObject.setMinutes(parseInt(minute[0]));
            
            return dateObject;
    }
    
}