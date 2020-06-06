import { Component, OnInit, OnDestroy } from '@angular/core';
import { City } from 'src/app/models/city.model';
import { Subscription } from 'rxjs';
import { CitiesService } from 'src/app/services/cities.service';
import { Router } from '@angular/router';

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

    constructor(public citiesService: CitiesService, private router: Router) {}

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
        if(screenWidth > 900)    this.numOfCols = 5;
        else if(screenWidth <= 900 && screenWidth > 700)    this.numOfCols = 4;
        else if(screenWidth <= 700 && screenWidth > 500)    this.numOfCols = 3;
        else if(screenWidth <= 500 && screenWidth > 400)    this.numOfCols = 2;
        else this.numOfCols = 1;
    }

    showMovies(cityId: string){
      localStorage.setItem('cityId', cityId);
      this.router.navigate(["/movies"]);
    }

    ngOnDestroy(){
      this.citiesSub.unsubscribe();
    }
}