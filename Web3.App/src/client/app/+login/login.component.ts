import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdInput} from '@angular2-material/input';
import {MdCheckbox} from '@angular2-material/checkbox';
import {MdRadioButton, MdRadioGroup, MdRadioDispatcher} from '@angular2-material/radio';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';

import {BackendService} from '../shared/backend.service';
import {AuthService} from '../shared/auth.service';
import {StateService} from '../shared/state.service';
import {LoggerService} from '../shared/logger.service';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES, MD_LIST_DIRECTIVES,
    MD_CARD_DIRECTIVES, MdToolbar, MdButton, MdInput,
    MdCheckbox, MdRadioGroup, MdRadioButton, MdIcon
  ],
  providers: [
    MdIconRegistry, MdRadioDispatcher
  ]
})
export class LoginComponent implements OnInit {
  userName: string;
  password: string;
  remember: boolean;

  constructor(private _router: Router,
    private _authService: AuthService,
    private _state: StateService,
    private _logger: LoggerService) {
    console.log('login ctor');
  }

  ngOnInit() {
    console.log('login init');
    console.log('state', this._state);
    this.userName = this._state.userName;
    this.password = this._state.password;
    this.remember = this._state.remember;
  }

  onSubmit() {
    this._state.userName = this.userName;
    this._state.password = this.password;
    this._state.remember = this.remember;
    console.log('state', this._state);
    this._authService.onAuthenticate(
      this.userName, this.password, this.remember,
      '/home');
  }
}
