import { GcloudTokenProviderService } from '../gcloud-token-provider/gcloud-token-provider.service';
export declare class AccessTokenGeneratorService {
    private gctproviderSrvc;
    private PLATFORM;
    private gcloudConfig;
    constructor(gctproviderSrvc: GcloudTokenProviderService);
    initiate(): void;
    detectPlatForm(): void;
    getGcloudConfig(): any;
    getAuthKey(): Promise<string>;
    refreshAuthKey(): Promise<boolean>;
}
