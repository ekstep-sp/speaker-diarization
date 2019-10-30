import { Module } from '@nestjs/common';
import { AccessTokenGeneratorService } from './services/access-token-generator/access-token-generator.service';
import { GcloudTokenProviderService } from './services/gcloud-token-provider/gcloud-token-provider.service';

@Module({
    providers: [AccessTokenGeneratorService, GcloudTokenProviderService],
    exports: [AccessTokenGeneratorService]
})
export class AutomateAccessTokenModule {}
