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
import {Session} from '../shared/session.model';

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
  sessions: Session[] = [
    new Session(1, 'Session 1'),
    new Session(2, 'Session 2'),
    new Session(3, 'Session 3'),
    new Session(4, 'Session 4'),
    new Session(5, 'Session 5'),
    new Session(6, 'Session 6')
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
