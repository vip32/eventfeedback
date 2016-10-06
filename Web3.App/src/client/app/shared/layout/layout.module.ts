import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { LayoutComponent } from './layout.component';

@NgModule({
    imports: [MaterialModule, RouterModule],
    declarations: [LayoutComponent],
    exports: [LayoutComponent],
})

export class LayoutModule { }
