import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})
export class ProfileComponent implements OnInit {
  environment: string = '<%= ENV %>';
  version: string = '<%= VERSION %>';
  appbase: string = '<%= APP_BASE %>';

  constructor(private _router: Router) { }

  ngOnInit() {
    console.log('profile init');
  }

  onDoneSelect() {
    console.log('profile done');
    this._router.navigate(['']); // home
  }
}
