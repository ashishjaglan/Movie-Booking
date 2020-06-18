import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TheatresService } from 'src/app/services/theatres.service';
import { Theatre } from 'src/app/models/theatre.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-theatre-list',
    styleUrls: ['./theatre-list.component.css'],
    templateUrl: './theatre-list.component.html'
})
export class TheatreListComponent implements OnInit, OnDestroy{
    numOfCols: number;
    theatres: Theatre[] = [];
    isLoading = false;
    private theatresSub: Subscription;

    constructor(public theatresService: TheatresService, public router: Router) {}

    ngOnInit() {        
      this.isLoading = true;
        this.setNumOfCols(window.innerWidth);
        this.theatresService.getTheatres();
        this.theatresSub = this.theatresService.getTheatresUpdateListener()
        .subscribe((theatres: Theatre[]) => {
          this.theatres = theatres;
          this.isLoading = false;
        });
      }
      
      showHalls(theatreId: string){
        this.router.navigate(["/manager/hallList/"+ theatreId]);
      }


      onResize(event) {
        this.setNumOfCols(event.target.innerWidth);
      }

    setNumOfCols(screenWidth: number){
        if(screenWidth > 900)    this.numOfCols = 6;
        else if(screenWidth <= 900 && screenWidth > 600)    this.numOfCols = 4;
        else if(screenWidth <= 600 && screenWidth > 400)    this.numOfCols = 3;
        else this.numOfCols = 1;
    }

    ngOnDestroy(){
      this.theatresSub.unsubscribe();
    }
}