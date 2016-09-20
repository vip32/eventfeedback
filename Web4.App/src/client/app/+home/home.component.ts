import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private _router: Router) { }

  ngOnInit() {
    console.log('home init');
  }
}
