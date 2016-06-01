import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Routes} from '@angular/router';
import {HTTP_PROVIDERS} from '@angular/http';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdInput} from '@angular2-material/input';
import {MdCheckbox} from '@angular2-material/checkbox';
import {MdRadioButton, MdRadioGroup, MdRadioDispatcher} from '@angular2-material/radio';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';

import {AboutComponent} from './+about/about.component';
import {ProfileComponent} from './+profile/profile.component';
import {Event} from './+sessions/shared/event.model';
import {EventComponent} from './+sessions/event/event.component';
import {Session} from './+sessions/shared/session.model';
import {SessionListComponent} from './+sessions/session-list/session-list.component';
import {BackendService} from './+sessions/shared/backend.service';

@Component({
  ///moduleId: module.id,
  selector: 'sd-app',
  templateUrl: './app/app.component.html',
  styleUrls: ['./app/app.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES,
    MD_LIST_DIRECTIVES,
    MD_CARD_DIRECTIVES,
    MdToolbar,
    MdButton,
    MdInput,
    MdCheckbox,
    MdRadioGroup,
    MdRadioButton,
    MdIcon,
    EventComponent,
    SessionListComponent
  ],
  providers: [HTTP_PROVIDERS, MdIconRegistry, MdRadioDispatcher, BackendService]
})
@Routes([
  {path: '/about', component: AboutComponent},
  {path: '/profile', component: ProfileComponent}
])
export class AppComponent {
  title = 'EventFeedback';
  selectedEvent: Event = null;
  events: Event[] = this._backendService.getEvents();
  sessions: Session[];

  constructor(private _backendService: BackendService) { }

  onEventSelected(event: Event) {
    console.log('event selected (list) ', event.id);
    this.selectedEvent = event;
    this.sessions = this._backendService.getSessions(event);
  }
}
