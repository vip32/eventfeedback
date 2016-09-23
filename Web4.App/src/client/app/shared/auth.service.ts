import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {BackendService, LoginBindingModel} from './backend.service';
import {LoggerService} from './logger.service';

@Injectable()
export class AuthService {
    isAuthenticated: boolean = false;
    userName: string = undefined;
    password: string = undefined;
    remember: boolean = undefined;
    token: string = undefined;
    authenticatedSince: Date;

    constructor(private _router: Router,
        private _logger: LoggerService,
        private _backendService: BackendService) {
        console.log('authservice ctor');

        this.userName = localStorage.getItem('userName');
        this.password = localStorage.getItem('password');
        this.remember = (localStorage.getItem('remember') === 'true');
        this.token = localStorage.getItem('token');
        if (localStorage.getItem('authenticatedSince') !== null) {
            this.authenticatedSince = new Date(localStorage.getItem('authenticatedSince'));
        }
    }

    onAuthenticate(userName: string, password: string, remember?: boolean,
        redirectRoute?: string) {
        console.log('onAuthenticate', this);
        this.isAuthenticated = false;
        this.userName = userName;
        this.password = password;
        this.remember = remember;
        this.token = undefined;
        this.authenticatedSince = undefined;

        localStorage.setItem('remember', this.remember.toString());
        localStorage.setItem('token', undefined);
        localStorage.setItem('authenticatedSince', undefined);
        if (remember) {
            localStorage.setItem('userName', userName);
            localStorage.setItem('password', password);
        } else {
            localStorage.setItem('userName', undefined);
            localStorage.setItem('password', undefined);
        }

        this._backendService.user_Token(
            new LoginBindingModel({ userName: userName, password: password }))
            .subscribe(data => {
                this.token = data['accessToken'];
                if (this.token.length > 0) {
                    this.isAuthenticated = true;
                    this.authenticatedSince = new Date();
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('authenticatedSince', this.authenticatedSince.toString());
                    console.log('isAuthenticated', this.isAuthenticated, this.token);
                    this._router.navigate([redirectRoute]).then(_ => {
                        //navigation done
                    });
                }
            }, error => {
                console.log('error', error);
            });
    }
}
