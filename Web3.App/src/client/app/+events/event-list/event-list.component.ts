import { Component, OnInit } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card/card';

import {Event} from  '../../shared/backend.service';;
import {BackendService} from '../../shared/backend.service';
import {BackendMockService} from '../../shared/backendmock.service';
import {LoggerService} from '../../shared/logger.service';
import {AuthService} from '../../shared/auth.service';

@Component({
    moduleId: module.id,
    selector: 'app-event-list',
    templateUrl: 'event-list.component.html',
    styleUrls: ['event-list.component.css'],
    directives: [ROUTER_DIRECTIVES, MdIcon, MD_LIST_DIRECTIVES, MD_CARD_DIRECTIVES],
    providers: [LoggerService, BackendService, BackendMockService],
    viewProviders: [MdIconRegistry]
})
export class EventListComponent implements OnInit {
    selectedEvent: Event = null;
    events: Event[] = this._backendService.getEvents();

    constructor(
        private _router: Router,
        private _authService: AuthService,
        private _backendService: BackendMockService,
        private _logger: LoggerService) {
        console.log('events ctor');
    }

    ngOnInit() {
        console.log('event-list init');
    }

    select(event: Event) {
        console.log('event selected ', event.id);
        this.selectedEvent = event;
        this._router.navigate(['/events/' + event.id]);
    };
}
