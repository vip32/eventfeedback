import { Component, EventEmitter, Input, Output, OnInit, } from '@angular/core';

import { Session, Feedback } from '../../shared/backend.service';;
import { BackendService } from '../../shared/backend.service';
import { BackendMockService } from '../../shared/backendmock.service';
import { LoggerService } from '../../shared/logger.service';
import { AuthService } from '../../shared/auth.service';

@Component({
    moduleId: module.id,
    selector: 'app-session',
    templateUrl: 'session.component.html',
    styleUrls: ['session.component.css'],
})
export class SessionComponent implements OnInit {
    @Input() session: Session;
    @Output() onSelected = new EventEmitter<Session>();

    isSelected: boolean = false;
    feedback: Feedback;

    constructor(private _authService: AuthService,
        private _backendService: BackendMockService,
        private _logger: LoggerService) {
        console.log('session ctor');
    }

    ngOnInit() {
        console.log('session init', this.session);
    }

    select(session: Session) {
        console.log('session selected ', session.id);
        if (!this.feedback) {
            this.feedback = this._backendService.getFeedback(session);
        }
        this.isSelected = !this.isSelected;
        this.onSelected.emit(session); // notify parent list
    };

    save() {
        console.log('save', this.feedback);
        // TODO: call backendservice
    }
}
