import { Component, OnInit } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';

import { LayoutComponent } from './shared/index';

import {AuthService} from './shared/auth.service';
import {LoggerService} from './shared/logger.service';
import {BackendService} from './shared/backend.service';
import {API_BASE_URL} from './shared/backend.service';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  viewProviders: [HTTP_PROVIDERS],
  templateUrl: 'app.component.html',
  directives: [ROUTER_DIRECTIVES, LayoutComponent],
  providers: [
    HTTP_PROVIDERS,
    AuthService, LoggerService, BackendService,
    {
      provide: API_BASE_URL, useValue:
        '<%= ENV %>' === 'dev' ? 'http://localhost:6003' : 'https://eventfeedback-staging.azurewebsites.net'/*window.location.href*/
    }]
})
export class AppComponent implements OnInit {
  constructor(private _router: Router,
        private _authService: AuthService) {
    console.log('Environment: ', '<%= ENV %>'.toUpperCase());
  }

  ngOnInit() {
        console.log('app init', this._authService.isAuthenticated);
        if (!this._authService.isAuthenticated) {
            this._router.navigate(['/login']);
        }
    }
}
