import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

import { LayoutModule } from './shared/layout/layout.module';
import { DebugModule } from './+debug/debug.module';
import { AboutModule } from './+about/about.module';
import { HomeModule } from './+home/home.module';
import { LoginModule } from './+login/login.module';
import { EventListModule } from './+events/event-list/event-list.module';
import { SessionListModule } from './+sessions/session-list/session-list.module';
import { SharedModule } from './shared/shared.module';

import {API_BASE_URL} from './shared/backend.service';
import { Config } from './shared/index';

@NgModule({
  imports: [BrowserModule, HttpModule, RouterModule.forRoot(routes),
    LayoutModule, DebugModule, AboutModule, HomeModule, LoginModule,
    EventListModule, SessionListModule, SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    {
      provide: API_BASE_URL,
      useValue: Config.API
    }],
  bootstrap: [AppComponent]
})

export class AppModule { }
