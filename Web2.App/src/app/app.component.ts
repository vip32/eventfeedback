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
import {SessionListComponent} from './session-list/session-list.component';

@Component({
  ///moduleId: module.id,
  selector: 'eventfeedback-app',
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
    SessionListComponent
  ],
  providers: [HTTP_PROVIDERS, MdIconRegistry, MdRadioDispatcher]
})
export class AppComponent {
  title = 'EventFeedback';
  selectedView = null;
  views: Object[] = [
    { name: 'Profile', description: 'Profile', icon: 'account_circle' },
    { name: 'Event 1', description: 'Event 1', icon: 'event' },
    { name: 'Event 2', description: 'Event 2', icon: 'event' },
    { name: 'Event 3', description: 'Event 3', icon: 'event' }
  ];
}
