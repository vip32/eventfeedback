import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Event } from '../../shared/backend.service';;
import { BackendService } from '../../shared/backend.service';
import { BackendMockService } from '../../shared/backendmock.service';
import { LoggerService } from '../../shared/logger.service';
import { AuthService } from '../../shared/auth.service';

@Component({
    moduleId: module.id,
    selector: 'app-event-list',
    templateUrl: 'event-list.component.html',
    styleUrls: ['event-list.component.css'],
    providers: [LoggerService, BackendService, BackendMockService]
})
export class EventListComponent implements OnInit {
    selectedEvent: Event = null;
    events: Event[] = null;

    constructor(
        private _router: Router,
        private _authService: AuthService,
        private _backendService: BackendMockService,
        private _logger: LoggerService) {
        console.log('events ctor');
    }

    ngOnInit() {
        console.log('event-list init');
        this.events = this._backendService.getEvents();
    }

    select(event: Event) {
        console.log('event selected ', event.id);
        this.selectedEvent = event;
        this._router.navigate(['/events', event.id]).then(_ => {
            //navigation done
        });
    };
}
