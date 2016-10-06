import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EventListComponent } from './event-list.component';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [EventListComponent],
    exports: [EventListComponent]
})
export class EventListModule { }
