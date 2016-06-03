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

import {LoggerService} from '../shared/logger.service';
import {AuthService} from '../shared/auth.service';

@Component({
  moduleId: module.id,
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES, MD_LIST_DIRECTIVES,
    MD_CARD_DIRECTIVES, MdToolbar, MdButton, MdInput,
    MdCheckbox, MdRadioGroup, MdRadioButton, MdIcon,
  ],
  providers: [MdIconRegistry, MdRadioDispatcher]
})
export class ProfileComponent implements OnInit {

  constructor(private _router: Router,
    private _authService: AuthService,
    private _logger: LoggerService) { }

  ngOnInit() {
    console.log('profile init');
    if (!this._authService.isAuthenticated) {
      this._router.navigate(['/login']);
    }
  }

  onDoneSelect() {
    this._router.navigate(['/home']);
  }
}
