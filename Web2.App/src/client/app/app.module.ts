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
import { ProfileModule } from './+profile/profile.module';
import { HomeModule } from './+home/home.module';
import { LoginModule } from './+login/login.module';
import { EventListModule } from './+events/event-list/event-list.module';
import { SessionListModule } from './+sessions/session-list/session-list.module';
import { SharedModule } from './shared/shared.module';

import {API_BASE_URL} from './shared/backend.service';
import { Config } from './shared/index';

@NgModule({
  imports: [BrowserModule, HttpModule, RouterModule.forRoot(routes),
    LayoutModule, DebugModule, AboutModule, ProfileModule, HomeModule, LoginModule,
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

// Azure AD auth + ADAL: https://github.com/AzureAD/azure-activedirectory-library-for-js/issues/194
// https://github.com/ITUnity/dev/tree/master/OpenIDConnect/src/OpenIDConnect/wwwroot/app
// https://www.itunity.com/article/angular-2-openid-connect-azure-active-directory-3093
// https://github.com/microsoftgraph/angular2-connect-rest-sample
// https://github.com/alenny/angular2-adal
// https://github.com/alenny/angular2-adal-example
// https://github.com/maliksahil/Angular2AzureADAuthLib