import { Component, OnInit, OnDestroy } from '@angular/core';
import { City } from 'src/app/models/city.model';
import { Subscription } from 'rxjs';
import { CitiesService } from 'src/app/services/cities.service';

@Component({
    selector: 'app-city-list',
    styleUrls: ['./city-list.component.css'],
    templateUrl: './city-list.component.html'
})
export class CityListComponent implements OnInit, OnDestroy{
    numOfCols: number;
    isLoading = false;
    cities: City[] = [];
    private citiesSub: Subscription;

    constructor(public citiesService: CitiesService) {}

    ngOnInit() {        
        this.setNumOfCols(window.innerWidth);
        this.isLoading = true;
        this.citiesService.getCities();
        this.citiesSub = this.citiesService.getCitiesUpdateListener()
        .subscribe((cities: City[]) => {
          this.isLoading = false;
          this.cities = cities;
        });
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
      this.citiesSub.unsubscribe();
    }
}