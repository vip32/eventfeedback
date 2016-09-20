import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DebugComponent } from './debug.component';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [DebugComponent],
    exports: [DebugComponent]
})
export class DebugModule { }
