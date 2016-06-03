import { Injectable } from '@angular/core';

@Injectable()
export class StateService {
    userName: string;
    password: string;
    remember: boolean;

    constructor() {
        console.log('state ctor');
     }
}