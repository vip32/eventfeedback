import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {BackendService, LoginBindingModel} from './backend.service';
import {LoggerService} from './logger.service';

@Injectable()
export class AuthService {
    isAuthenticated: boolean = false;
    token: string = undefined;
    authenticatedSince: Date;

    constructor(private _router: Router,
        private _logger: LoggerService,
        private _backendService: BackendService) {
            console.log('authservice ctor');
        }

    // backendservice should actually be injected into ctor, but that does not work with the DI now
    onAuthenticate(userName: string, password: string, remember?: boolean,
        redirectRoute?: string) {
        console.log('onAuthenticate', this);
        this.isAuthenticated = false;
        this.token = undefined;
        this.authenticatedSince = undefined;

        this._backendService.user_Token(
            new LoginBindingModel({ userName: userName, password: password }))
            .subscribe(data => {
                this.token = data['accessToken'];
                if (this.token.length > 0) {
                    this.isAuthenticated = true;
                    this.authenticatedSince = new Date();
                    console.log('isAuthenticated', this.isAuthenticated, this.token);
                    if (redirectRoute.length > 0) {
                        this._router.navigate([redirectRoute]);
                    }
                }
            }, error => {
                console.log('error', error);
            });
    }
}
