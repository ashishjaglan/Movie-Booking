import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CityListComponent } from './user/cities/city-list.component';
import { MovieListComponent } from './user/movies/movie-list.component';
import { ShowListComponent } from './user/showsList/show-list.component';
import { ShowComponent } from './user/show/show.component';
import { CityCreateComponent } from './manager/cities/city-create/city-create.component';
import { MovieCreateComponent } from './manager/movies/movie-create/movie-create.component';
import { TheatreCreateComponent } from './manager/theatres/theatre-create/theatre-create.component';
import { TheatreListComponent } from './manager/theatres/theatre-list/theatre-list.component';
import { HallListComponent } from './manager/halls/hall-list/hall-list.component';
import { HallCreateComponent } from './manager/halls/hall-create/hall-create.component';
import { HallShowComponent } from './manager/halls/hall-show/hall-show.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserAuthGuard } from './auth/auth.guard'
import { EventCreateComponent } from './manager/events/event-create/event-create.component';
import { EventListComponent } from './user/events/event-list.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: CityListComponent },
  { path: 'movies', component: MovieListComponent },
  { path: 'events', component: EventListComponent },
  { path: 'shows/:sourceId', component: ShowListComponent },
  { path: 'show/:showId', component: ShowComponent, canActivate: [UserAuthGuard] },
  { path: 'manager/city', component: CityCreateComponent },
  { path: 'manager/movie', component: MovieCreateComponent },
  { path: 'manager/event', component: EventCreateComponent },
  { path: 'manager/theatreCreate', component: TheatreCreateComponent },
  { path: 'manager/theatreList', component: TheatreListComponent },
  { path: 'manager/hallList/:theatreId', component: HallListComponent },
  { path: 'manager/hallCreate/:theatreId', component: HallCreateComponent },
  { path: 'manager/hallShow/:hallId', component: HallShowComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [UserAuthGuard]
})
export class AppRoutingModule { }
