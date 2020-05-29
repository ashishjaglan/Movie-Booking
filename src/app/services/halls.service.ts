import { Injectable } from '@angular/core';
import { Hall } from '../models/hall.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class HallsService{
    private halls: Hall[] = [];
    private hallsUpdated = new Subject<{}>();

    constructor(private http: HttpClient, private router: Router) {}

    getHalls(theatreId: string){
        this.http.get<{message: string, halls: any}>('http://localhost:3000/api/hall/' + theatreId)
        .pipe(map((hallData) => {
            return hallData.halls.map(hall => {
                return {
                    name: hall.name,
                    id: hall._id,
                    theaterId: hall.theatreId,
                    rows: hall.rows,
                    cols: hall.cols
                };
            })
        }))
        .subscribe((transformedHalls) => {
            this.halls = transformedHalls;
            this.hallsUpdated.next([...this.halls]);
        });
    }

    getHall(hallId: string){
        return this.http.get<{
            _id: string, 
            theatreId: string, 
            name: string, 
            rows: string[],
            cols: string[]
        }>( 'http://localhost:3000/api/hall/data/' + hallId)
    }

    getHallsUpdateListener(){
        return this.hallsUpdated.asObservable();
    }


    addHall(theaterId: string, name: string, rows: string, cols: string){
        var alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
        var rowsArray: string[] = alphabet.slice(0,parseInt(rows));

        var colsArray: string[] = ['1'];
        for (let step = 2; step <= parseInt(cols); step++) {
            colsArray.push(step.toString());
          }

        const hall: Hall = { id: null, theatreId: theaterId, name: name, rows: rowsArray, cols: colsArray };
        //console.log(hall);
        
        this.http
            .post<{ message: string}>('http://localhost:3000/api/hall', hall)
            .subscribe((responseData) => {
                //console.log(responseData);                
                this.router.navigate(["/manager/hallList/"+ theaterId]);
            });
        
    }

}