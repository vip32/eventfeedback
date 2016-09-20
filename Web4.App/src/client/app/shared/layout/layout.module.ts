import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdButtonModule } from '@angular2-material/button';
import { MdIconModule } from '@angular2-material/icon';
import { MdSidenavModule } from '@angular2-material/sidenav';
import { MdListModule } from '@angular2-material/list';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { LayoutComponent } from './layout.component';

@NgModule({
    imports: [MdButtonModule, MdIconModule, MdSidenavModule, MdListModule, MdToolbarModule, RouterModule],
    declarations: [LayoutComponent],
    exports: [LayoutComponent],
})

export class LayoutModule { }
