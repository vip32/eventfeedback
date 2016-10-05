import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Session } from '../../shared/backend.service';;
import { BackendService } from '../../shared/backend.service';
import { BackendMockService } from '../../shared/backendmock.service';
import { LoggerService } from '../../shared/logger.service';
import { AuthService } from '../../shared/auth.service';

@Component({
    moduleId: module.id,
    selector: 'app-session-list',
    templateUrl: 'session-list.component.html',
    styleUrls: ['session-list.component.css'], 
})
export class SessionListComponent implements OnInit {
    selectedSession: Session = null;
    eventId: number;
    sessions: Session[] = null;

    constructor(
        private route: ActivatedRoute,
        private _authService: AuthService,
        private _backendService: BackendMockService,
        private _logger: LoggerService) {
        console.log('sessionlist ctor');
        //this.eventId = route.params.map(r => r['eventId']);
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.eventId = +params['eventId']; // (+) converts string 'id' to a number
            console.log('session-list eventId:', this.eventId);

            // In a real app: dispatch action to load the details here.
            this.sessions = this._backendService.getSessions(this.eventId);
        });
    }

    select(session: Session) {
        console.log('session selected (list) ', session.id); // TODO: seems to be null, needed?
        this.selectedSession = session;
    }
}
