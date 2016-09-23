import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Config } from './shared/index';
import {AuthService} from './shared/auth.service';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
    moduleId: module.id,
    selector: 'sd-app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {
    constructor(private _router: Router,
        private _authService: AuthService) {
        console.log('Config', Config);
    }

    ngOnInit() {
        console.log('app init', this._authService.isAuthenticated);
        if (!this._authService.isAuthenticated) {
            console.log('redirecting to login');
            this._router.navigate(['/login']);
        }
    }
}
