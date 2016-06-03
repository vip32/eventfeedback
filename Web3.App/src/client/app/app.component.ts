import {Component, OnInit} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {HTTP_PROVIDERS} from '@angular/http';

import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card/card';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';
import {MdButton} from '@angular2-material/button/button';
import {MdInput} from '@angular2-material/input/input';
import {MdCheckbox} from '@angular2-material/checkbox/checkbox';
import {MdRadioButton, MdRadioGroup, MdRadioDispatcher} from '@angular2-material/radio/radio';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon/icon';

import {HomeComponent} from './+home/home.component';
import {AboutComponent} from './+about/about.component';
import {ProfileComponent} from './+profile/profile.component';
import {LoginComponent} from './+login/login.component';

import {Event, Session} from  './shared/backend.service';;
import {EventComponent} from './+sessions/event/event.component';
import {SessionListComponent} from './+sessions/session-list/session-list.component';
import {BackendMockService} from './shared/backendmock.service';
import {BackendService} from './shared/backend.service';
import {AuthService} from './shared/auth.service';
import {LoggerService} from './shared/logger.service';

@Component({
  //moduleId: module.id,
  selector: 'sd-app',
  templateUrl: '<%= ENV %>' === 'dev' ? './app/app.component.html': 'app.component.html', //FIX: remove ./app/ for PROD build
  styleUrls: [ '<%= ENV %>' === 'dev' ? './app/app.component.css': 'app.component.css'],  //FIX: remove ./app/ for PROD build
  directives: [
    ROUTER_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES, MD_LIST_DIRECTIVES,
    MD_CARD_DIRECTIVES, MdToolbar, MdButton, MdInput,
    MdCheckbox, MdRadioGroup, MdRadioButton, MdIcon,
    EventComponent, SessionListComponent
  ],
  providers: [
    HTTP_PROVIDERS,
    MdIconRegistry, MdRadioDispatcher,
    BackendMockService, BackendService , AuthService, LoggerService]
})
@Routes([
  { path: '/home', component: HomeComponent },
  { path: '/about', component: AboutComponent },
  { path: '/profile', component: ProfileComponent },
  { path: '/login', component: LoginComponent }
])
export class AppComponent implements OnInit {
  title = 'Event|Feedback';
  selectedEvent: Event = null;
  events: Event[] = this._backendService.getEvents();
  sessions: Session[];

  constructor(private _router: Router,
    private _backendService: BackendMockService,
    private _logger: LoggerService) {
      console.log('app ctor');
      console.log( '<%= ENV %>');
    }

  ngOnInit() {
    console.log('app init');
    this._router.navigate(['/home']);
  }

  onEventSelected(event: Event) {
    console.log('event selected (list) ', event.id);
    this.selectedEvent = event;
    this.sessions = this._backendService.getSessions(event);
    console.log('sessions', this.sessions);
  }

  onHome() {
    this._router.navigate(['/home']);
  }
}
