import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SessionListComponent } from './session-list/session-list.component';
import { SessionComponent } from './session/session.component';

import { BackendService } from '../shared/backend.service';
import { BackendMockService } from '../shared/backendmock.service';
import { LoggerService } from '../shared/logger.service';
import { AuthService } from '../shared/auth.service';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [SessionListComponent, SessionComponent],
    exports: [SessionListComponent],
    providers: [LoggerService, BackendService, BackendMockService, AuthService]
})
export class SessionModule { }
