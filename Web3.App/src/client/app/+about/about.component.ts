import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {MD_CARD_DIRECTIVES} from '@angular2-material/card/card';
import {MdButton} from '@angular2-material/button/button';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon/icon';

@Component({
  moduleId: module.id,
  selector: 'app-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css'],
  directives: [ROUTER_DIRECTIVES, MD_CARD_DIRECTIVES, MdButton, MdIcon],
  providers: [MdIconRegistry]
})
export class AboutComponent implements OnInit {
  environment: string = '<%= ENV %>';
  version: string = '<%= VERSION %>';
  appbase: string = '<%= APP_BASE %>';

  constructor(private _router: Router) { }

  ngOnInit() {
    console.log('about init');
  }

  onDoneSelect() {
    console.log('about done');
    this._router.navigate(['']); // home
  }
}
