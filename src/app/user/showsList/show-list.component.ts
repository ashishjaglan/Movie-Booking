import { Component, OnInit } from '@angular/core';
import { Show } from 'src/app/models/show.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ShowsService } from 'src/app/services/shows.service';
import { Subscription } from 'rxjs';
import { MoviesService } from 'src/app/services/movies.service';
import { EventsService } from 'src/app/services/events.service';

@Component({
    selector: 'app-show-list',
    styleUrls: ['./show-list.component.css'],
    templateUrl: './show-list.component.html'
})

export class ShowListComponent implements OnInit{
    isLoading = false;
    isSourceLoading = false;
    sourceId: string;
    isMovie = true;
    source: any;
    shows: Show[] = [];
    showsSub: Subscription;

    constructor(private showsService: ShowsService, private moviesService: MoviesService, 
        private eventsService: EventsService, private route: ActivatedRoute) {}

    ngOnInit(){
        this.route.queryParams.subscribe((paramMap) => {
            if(paramMap['sourceId'] != null){
                this.sourceId = paramMap['sourceId'];
                this.isLoading = true;
                this.showsService.getShows(this.sourceId);
                this.showsSub = this.showsService.getShowsUpdateListener()
                .subscribe((shows: Show[]) => {
                    this.isLoading = false;
                    this.shows = shows;
                    });
                }
            
            if(paramMap['isMovie'] === 'true'){
                this.isSourceLoading = true;
                this.isMovie = true;
                this.moviesService.getMovie(this.sourceId).subscribe(sourceData => {
                    this.source = sourceData
                    this.isSourceLoading = false;
                });
            }else{
                this.isSourceLoading = true;
                this.isMovie = false;
                this.eventsService.getEvent(this.sourceId).subscribe(sourceData => {
                    this.source = sourceData
                    this.isSourceLoading = false;
                });
            }
        });
    }
}