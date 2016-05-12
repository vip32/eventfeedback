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
import {SessionComponent} from '../session/session.component';

@Component({
  moduleId: module.id,
  selector: 'app-session-list',
  templateUrl: 'session-list.component.html',
  styleUrls: ['session-list.component.css'],
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
    SessionComponent
  ],
  providers: [HTTP_PROVIDERS, MdIconRegistry, MdRadioDispatcher]
})
export class SessionListComponent {
  ///selectedSession = null;
  sessions: Object[] = [
    { id: 1, name: 'Session 1' },
    { id: 2, name: 'Session 2' },
    { id: 3, name: 'Session 3' },
    { id: 4, name: 'Session 4' },
    { id: 5, name: 'Session 5' },
    { id: 6, name: 'Session 6' }
  ];

  // select(session) {
  //   /// this.isVisible = !this.isVisible;
  //   if (this.selectedSession && session && this.selectedSession.id == session.id) {
  //     this.selectedSession = null;
  //   } else {
  //     this.selectedSession = session;
  //   }
  //   console.log(session);
  // }
}
