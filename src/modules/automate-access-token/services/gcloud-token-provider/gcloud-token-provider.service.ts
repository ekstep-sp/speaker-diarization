import { Injectable } from '@nestjs/common';
import {env} from 'process';

@Injectable()
export class GcloudTokenProviderService {
    private _auth_key;
    constructor() {}

    setAuthKey(newKey: string) {
        console.log('setting new auth key');
        this._auth_key = this.cleanKey(newKey);
        // make key invalid, testing purpose
        // this._auth_key = this.makeIncorrect(this._auth_key);

        env['PROCESS_TOKEN_AUTH_KEY'] = this._auth_key.toString();
        console.log(env['PROCESS_TOKEN_AUTH_KEY']);
    }

    get process_token(): string {
        return env['PROCESS_TOKEN_AUTH_KEY'];
    }

    cleanKey(keyString: string) {
        const newKey = keyString.replace('\n', '').replace('\r', '');
        return newKey;
    }

    makeIncorrect(keyString: string) {
        const newKey = keyString.replace('c', 'x');
        return newKey;
    }
}
