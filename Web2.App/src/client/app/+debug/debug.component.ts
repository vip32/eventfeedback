import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'app-debug',
    templateUrl: 'debug.component.html'
})
export class DebugComponent implements OnInit {
    constructor(private _router: Router) { }

    ngOnInit() {
        console.log('debug init');
    }
}
