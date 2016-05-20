import {Component} from '@angular/core';
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
import {EventComponent} from './+events/event/event.component';
import {Event} from './+events/shared/event.model';
import {Session} from './+sessions/shared/session.model';
import {SessionListComponent} from './+sessions/session-list/session-list.component';

@Component({
  ///moduleId: module.id,
  selector: 'sd-app',
  templateUrl: './app/app.component.html',
  styleUrls: ['./app/app.component.css'],
  directives: [
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
  providers: [HTTP_PROVIDERS, MdIconRegistry, MdRadioDispatcher]
})
export class AppComponent {
  title = 'EventFeedback';
  selectedEvent: Event = null;
  events: Event[] = [
    new Event(1, 'Event 1', 'Event 1a'),
    new Event(2, 'Event 2', 'Event 2b'),
    new Event(3, 'Event 3', 'Event 3c'),
  ];
  sessions: Session[] = null;
  onEventSelected(event: Event) {
    console.log('load sessions for event ', event);
    this.selectedEvent = event;
    this.sessions = [
      new Session(1, 'Session 1 ' + event.name),
      new Session(2, 'Session 2 ' + event.name),
      new Session(3, 'Session 3 ' + event.name),
      new Session(4, 'Session 4 ' + event.name),
      new Session(5, 'Session 5 ' + event.name),
      new Session(6, 'Session 6 ' + event.name)
    ];
  }
}
