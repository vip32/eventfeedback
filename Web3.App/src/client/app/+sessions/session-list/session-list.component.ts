import {Component, Input, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
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

import {LoggerService} from '../../shared/logger.service';
import {AuthService} from '../../shared/auth.service';
import {SessionComponent} from '../session/session.component';
import {Session} from '../../shared/backend.service';

@Component({
  moduleId: module.id,
  selector: 'app-session-list',
  templateUrl: 'session-list.component.html',
  styleUrls: ['session-list.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES, MD_LIST_DIRECTIVES,
    MD_CARD_DIRECTIVES, MdToolbar, MdButton, MdInput,
    MdCheckbox, MdRadioGroup, MdRadioButton, MdIcon,
    SessionComponent
  ],
  providers: [HTTP_PROVIDERS, MdIconRegistry, MdRadioDispatcher]
})
export class SessionListComponent implements OnInit {
  @Input() sessions: Session[];
  selectedSession: Session = null;

  constructor(private _router: Router,
    private _authService: AuthService,
    private _logger: LoggerService) { }

  ngOnInit() {
    // console.log('session-list init');
    // if (!this._authService.isAuthenticated) {
    //   this._router.navigate(['/login']);
    // }
  }

  onSessionSelected(session: Session) {
    console.log('session selected (list) ', session.id);
    this.selectedSession = session;
  }
}
