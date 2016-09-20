import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    selector: 'app-session-list',
    templateUrl: 'session-list.component.html'
})
export class SessionListComponent implements OnInit, OnDestroy {
    eventId: Observable<string>;

    constructor(
        private route: ActivatedRoute) {
        this.eventId = route.params.map(r => r['eventId']);
    }

    ngOnInit() {
        console.log('session-list params:', this.route.params);
    }

    ngOnDestroy() {
        console.log('destroy session-list');
    }
}
