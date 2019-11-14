import { GcloudTokenProviderService } from '../gcloud-token-provider/gcloud-token-provider.service';
export declare class AccessTokenGeneratorService {
    private gctproviderSrvc;
    private PLATFORM;
    private gcloudConfig;
    private commandToExecute;
    constructor(gctproviderSrvc: GcloudTokenProviderService);
    initiate(): void;
    detectPlatForm(): void;
    getGcloudConfig(): {
        google_cloud_installation_path: string;
        google_cloud_authentication_file_path: string;
    };
    getGCLOUD_INSTALLATION_PATH(gcloud_config_url: any, global_config: any): any;
    getGCLOUD_CREDENTIAL_FILE_PATH(gcloud_config_url: any, global_config: any): any;
    getAuthKey(): Promise<string>;
    refreshAuthKey(): Promise<boolean>;
}
