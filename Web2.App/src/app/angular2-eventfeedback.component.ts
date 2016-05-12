import { Component } from '@angular/core';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdInput} from '@angular2-material/input';
import {MdCheckbox} from '@angular2-material/checkbox';
import {MdRadioButton, MdRadioGroup, MdRadioDispatcher} from '@angular2-material/radio';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';

@Component({
  moduleId: module.id,
  selector: 'angular2-eventfeedback-app',
  templateUrl: 'angular2-eventfeedback.component.html',
  styleUrls: ['angular2-eventfeedback.component.css'],
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
    MdIcon
  ],
  providers: [MdIconRegistry, MdRadioDispatcher]
})
export class Angular2EventfeedbackAppComponent {
  title = 'eventfeedback';
  views: Object[] = [
    {
      name: "My Account",
      description: "Edit my account information",
      icon: "assignment ind"
    },
    {
      name: "Sessions",
      description: "Find your session",
      icon: "session"
    }
  ];
  sessions: Object[] = [
    {name: "Session 1"},
    {name: "Session 2"},
    {name: "Session 3"},
    {name: "Session 4"},
    {name: "Session 5"},
    {name: "Session 6"}
  ];
}
