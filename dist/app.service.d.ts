import { AccessTokenGeneratorService } from './modules/automate-access-token/services/access-token-generator/access-token-generator.service';
export declare class AppService {
    private atgSrvc;
    constructor(atgSrvc: AccessTokenGeneratorService);
    getServerStatus(): string;
}
