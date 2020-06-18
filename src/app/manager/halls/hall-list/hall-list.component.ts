import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Hall } from 'src/app/models/hall.model';
import { HallsService } from 'src/app/services/halls.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-hall-list',
    styleUrls: ['./hall-list.component.css'],
    templateUrl: './hall-list.component.html'
})
export class HallListComponent implements OnInit{
    theatreId: string;
    numOfCols: number;
    halls: Hall[] = [];
    isLoading = false;
    private hallsSub: Subscription;

    constructor(public hallsService: HallsService, public route: ActivatedRoute, public router: Router) {}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('theatreId')){
                this.isLoading = true;
                this.theatreId = paramMap.get('theatreId');
                this.hallsService.getHalls(this.theatreId);
                this.hallsSub = this.hallsService.getHallsUpdateListener()
                .subscribe((halls: Hall[]) => {
                this.halls = halls;
                this.isLoading = false;
                });
            }                      
        });

        this.setNumOfCols(window.innerWidth);
    }

    showHall(hallId: string){
        this.router.navigate(["manager/hallShow/" + hallId]);
    }

    navigateToHallCreate(){
        this.router.navigate(["manager/hallCreate/" + this.theatreId]);
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

}