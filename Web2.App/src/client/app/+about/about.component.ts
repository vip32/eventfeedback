import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css']
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
