import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CityListComponent } from './user/cities/city-list.component'
import { HeaderComponent } from './header/header.component';
import { MovieListComponent } from './user/movies/movie-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { EventCreateComponent } from './manager/events/event-create/event-create.component';
import { EventListComponent } from './user/events/event-list.component';


@NgModule({
  declarations: [
    AppComponent,
    CityCreateComponent,
    CityListComponent,
    MovieListComponent,
    MovieCreateComponent,
    EventListComponent,
    EventCreateComponent,
    ShowListComponent,
    ShowComponent,
    TheatreCreateComponent,
    TheatreListComponent,
    HallListComponent,
    HallCreateComponent,
    HallShowComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatGridListModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    NgxMaterialTimepickerModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
export class MyModule { }
