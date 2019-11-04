export declare class GcloudTokenProviderService {
    private _auth_key;
    constructor();
    setAuthKey(newKey: string): void;
    readonly process_token: string;
    cleanKey(keyString: string): string;
    makeIncorrect(keyString: string): string;
}
