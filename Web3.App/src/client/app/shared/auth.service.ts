import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {BackendService, LoginBindingModel} from './backend.service';

@Injectable()
export class AuthService {
    isAuthenticated: boolean = false;
    userName: string = undefined;
    token: string = undefined;
    password: string = undefined;
    remember: boolean = false;

    constructor(private _router: Router) { }

    // backendservice should actually be injected into ctor, but that does not work with the DI now
    onAuthenticate(backendService: BackendService,
        userName: string, password: string, remember?: boolean,
        redirectRoute?: string) {
        console.log('onAuthenticate', this)
        this.isAuthenticated = false;
        this.userName = userName;
        this.password = password;
        this.remember = remember;
        this.token = undefined;

        backendService.user_Token(
            new LoginBindingModel({ userName: userName, password: password }))
            .subscribe(data => {
                this.token = data['accessToken'];
                if (this.token.length > 0) {
                    this.isAuthenticated = true;
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
