import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
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

import {Session, Feedback} from '../../shared/backend.service';
import {BackendMockService} from '../../shared/backendmock.service';

@Component({
  moduleId: module.id,
  selector: 'app-session',
  templateUrl: 'session.component.html',
  styleUrls: ['session.component.css'],
  directives: [
    MD_SIDENAV_DIRECTIVES, MD_LIST_DIRECTIVES,
    MD_CARD_DIRECTIVES, MdToolbar, MdButton, MdInput,
    MdCheckbox, MdRadioGroup, MdRadioButton, MdIcon,
  ],
  providers: [HTTP_PROVIDERS,
    MdIconRegistry, MdRadioDispatcher
  ]
})
export class SessionComponent implements OnInit {
  @Input() session: Session;
  @Output() onSelected = new EventEmitter<Session>();

  isSelected: boolean = false;
  feedback: Feedback;

  constructor(private _backendService: BackendMockService) {
    console.log('session ctor');
  }

  ngOnInit() {
    console.log('session init', this.session);
  }

  select(session: Session) {
    console.log('session selected ', session.id);
    if (!this.feedback) {
      this.feedback = this._backendService.getFeedback(session);
    }
    this.isSelected = !this.isSelected;
    this.onSelected.emit(session); // notify parent list
  };

  save() {
    console.log('save', this.feedback);
    // TODO
  }
}
