import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { SessionListComponent } from './session-list.component';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [SessionListComponent],
    exports: [SessionListComponent]
})
export class SessionListModule { }
