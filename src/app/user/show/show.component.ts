import { Component, OnInit } from '@angular/core';
import { BookingsService } from 'src/app/services/bookings.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Show } from 'src/app/models/show.model';
import { Subscription } from 'rxjs';
import { ShowsService } from 'src/app/services/shows.service';

@Component({
    selector: 'app-show',
    styleUrls: ['./show.component.css'],
    templateUrl: './show.component.html'
})

export class ShowComponent implements OnInit{
    isLoading = false;
    show: Show;
    showId: string;
    selected: number[] = [];
    rows: number;
    alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
    rowsArray: string[];

    colsArray: number[] = [1];
    

    constructor(public showsService: ShowsService, public bookingService: BookingsService, public route: ActivatedRoute) {}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('showId')){
                this.showId = paramMap.get('showId');
                this.isLoading = true;
                this.showsService.getShow(this.showId).subscribe(showData => {
                    this.show = {
                        id: showData._id,
                        sourceId: showData.sourceId,
                        isMovie: showData.isMovie,
                        theatreData: showData.theatreData,
                        hallId: showData.hallId,
                        startTime :new Date(showData.startTime),
                        endTime: new Date(showData.endTime),
                        price: showData.price,
                        seatsAvailable: showData.seatsAvailable,
                        seats: showData.seats,
                        cols: showData.cols
                    };
                    this.seatLayout();
                    //this.isLoading = false;
                });
            }        
        });
    }

    seatLayout(){
        this.rows = this.show.seats.length / this.show.cols;
        this.rowsArray = this.alphabet.slice(0,this.rows);

        for (let step = 2; step <= this.show.cols; step++) {
            this.colsArray.push(step);
        }
        this.isLoading = false;
    }

    // seat onClick
    seatClicked(rowNumber, colNumber) {
        rowNumber = rowNumber.charCodeAt(0)-65;
        let index = (rowNumber * this.show.cols) + colNumber-1;
        if(this.show.seats[index]==1) {
            console.log("Seat already booked");            
            return;
        }
        console.log("Selected Seat: " + index);
        var i = this.selected.indexOf(index);
        if(i != -1) {
            // seat already selected, remove
            this.selected.splice(i, 1)
        } else {
            // new seat, push
            this.selected.push(index);
        }
    }

    // get seat status
    getStatus(rowNumber, colNumber) {
        rowNumber = rowNumber.charCodeAt(0)-65;
        let index = (rowNumber * this.show.cols) + colNumber-1;
        if(this.show.seats[index]==1) {
            return 'reserved';
        } else if(this.selected.indexOf(index) > -1) {
            return 'selected';
        }
    }

    clearSelected() {
        this.selected = [];
    }

    bookSeats(){
        console.log(this.selected);
        this.bookingService.addBooking(this.showId, this.show.price*this.selected.length, this.selected);
    }

}