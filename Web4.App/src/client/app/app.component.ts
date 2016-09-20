import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Config } from './shared/index';

import {AuthService} from './shared/auth.service';
// import {API_BASE_URL} from './shared/backend.service';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  providers: [
    AuthService,
    // {
    //   provide: API_BASE_URL, useValue:
    //     '<%= ENV %>' === 'dev' ? 'http://localhost:6003' : 'https://eventfeedback-staging.azurewebsites.net'/*window.location.href*/
    // }
    ]
})

export class AppComponent implements OnInit {
  constructor(private _router: Router,
        private _authService: AuthService) {
          console.log('Environment config', Config);
          console.log('Environment: ', '<%= ENV %>'.toUpperCase());
  }

  ngOnInit() {
        console.log('app init', this._authService.isAuthenticated);
        if (!this._authService.isAuthenticated) {
            this._router.navigate(['/login']);
        }
    }
}
