import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../shared/auth.service';
import {LoggerService} from '../shared/logger.service';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
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
