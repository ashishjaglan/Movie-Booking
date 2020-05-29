import { Component, OnInit } from '@angular/core';
import { Show } from 'src/app/models/show.model';
import { ListPopulatingService } from '../listpopulating.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ShowsService } from 'src/app/services/shows.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-show-list',
    styleUrls: ['./show-list.component.css'],
    templateUrl: './show-list.component.html'
})

export class ShowListComponent implements OnInit{

    sourceId: string;
    shows: Show[] = [];
    showsSub: Subscription;

    constructor(public showsService: ShowsService, public route: ActivatedRoute) {}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('sourceId')){
                this.sourceId = paramMap.get('sourceId');
            }        
        this.showsService.getShows(this.sourceId);
        this.showsSub = this.showsService.getShowsUpdateListener()
        .subscribe((shows: Show[]) => {
          this.shows = shows;
        });
        });
    }
}