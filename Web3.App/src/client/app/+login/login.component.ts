import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card/card';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';
import {MdButton} from '@angular2-material/button/button';
import {MdInput} from '@angular2-material/input/input';
import {MdCheckbox} from '@angular2-material/checkbox/checkbox';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon/icon';

import {AuthService} from '../shared/auth.service';
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
    MdCheckbox, MdIcon
  ],
  providers: [MdIconRegistry]
})
export class LoginComponent implements OnInit {
  userName: string;
  password: string;
  remember: boolean = true;

  constructor(private _router: Router,
    private _authService: AuthService,
    private _logger: LoggerService) {
    console.log('login ctor');
  }

  ngOnInit() {
    console.log('login init');
    if (this._authService.remember) {
      this.userName = this._authService.userName;
      this.password = this._authService.password;
      this.remember = this._authService.remember;
    };
  }

  onSubmit() {
    this._authService.onAuthenticate(
      //this.userName, this.password, this.remember, '');
      this.userName, this.password, this.remember, '/events');
  }
}
