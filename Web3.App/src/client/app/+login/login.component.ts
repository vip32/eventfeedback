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

import {BackendService, LoginBindingModel} from '../shared/backend.service';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
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
    providers: [MdIconRegistry, MdRadioDispatcher, BackendService]
})
export class LoginComponent implements OnInit {
  model = new LoginBindingModel();
  accessToken: string;
  authorized: boolean = false;

  constructor(private _router: Router, private _backendService: BackendService) {}

  ngOnInit() {}

  onSubmit() {
      console.log('submit', this.model);
      this.accessToken = '';
      this.authorized = false;

      this._backendService.user_Token(this.model).subscribe(data => {
            this.accessToken = data['accessToken'];
            this.authorized = true;
        }, error => {
            console.log('error', error);
        });
     // this._router.navigate(['/home']);
  }
}
