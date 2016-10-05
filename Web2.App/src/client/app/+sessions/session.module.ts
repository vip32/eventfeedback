import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SessionListComponent } from './session-list/session-list.component';
import { SessionComponent } from './session/session.component';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [SessionListComponent, SessionComponent],
    exports: [SessionListComponent]
})
export class SessionModule { }
