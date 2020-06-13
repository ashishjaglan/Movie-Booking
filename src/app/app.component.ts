import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { UserAuthService } from './services/userAuth.service';
import { ManagerAuthService } from './services/managerAuth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'movie-booking';
  mediaSub: Subscription;
  deviceXs: boolean;
  constructor(public mediaObserver: MediaObserver, private userAuthService: UserAuthService, private managerAuthService: ManagerAuthService) {}
  
  ngOnInit() {
    this.mediaSub = this.mediaObserver.media$.subscribe((res: MediaChange) => {
      console.log(res.mqAlias);
      this.deviceXs = res.mqAlias === "xs" ? true : false;
    })
    this.userAuthService.autoAuthUser();
    this.managerAuthService.autoAuthManager();
  }
  ngOnDestroy() {
    this.mediaSub.unsubscribe();
  }
}
