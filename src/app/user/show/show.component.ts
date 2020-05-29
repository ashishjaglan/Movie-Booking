import { Component } from '@angular/core';
import { ShowsService } from 'src/app/services/shows.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Show } from 'src/app/models/show.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-show',
    styleUrls: ['./show.component.css'],
    templateUrl: './show.component.html'
})

export class ShowComponent{

    show: Show;
    showId: string;
    selected: string[] = [];

    constructor(public showsService: ShowsService, public route: ActivatedRoute) {}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('showId')){
                this.showId = paramMap.get('showId');
                this.showsService.getShow(this.showId).subscribe(showData => {
                    this.show = {
                        id: showData._id,
                        sourceId: showData.sourceId,
                        theatreData: showData.theatreData,
                        hallId: showData.hallId,
                        date: showData.date,
                        startTime: showData.startTime,
                        endTime: showData.endTime,
                        price: showData.price,
                        seatsAvailable: showData.seatsAvailable,
                        rows: showData.rows,
                        cols: showData.cols,
                        reservedSeats: showData.reservedSeats
                    };
                });
            }        
        
        });
    }
        // seat onClick
        seatClicked(seatPos) {
            console.log("Selected Seat: " + seatPos);
            var index = this.selected.indexOf(seatPos);
            if(index != -1) {
                // seat already selected, remove
                this.selected.splice(index, 1)
            } else {
                // new seat, push
                this.selected.push(seatPos);
            }
        }

        // get seat status
        getStatus(seatPos) {
            if(this.show.reservedSeats && this.show.reservedSeats.indexOf(seatPos) > -1) {
                return 'reserved';
            } else if(this.selected.indexOf(seatPos) > -1) {
                return 'selected';
            }
        }

        clearSelected() {
            this.selected = [];
        }

        showSelected() {
            if(this.selected.length > 0) {
                alert("Selected Seats: \n" + this.selected);
            } else {
                alert("No seats selected!");
            }
        }

}