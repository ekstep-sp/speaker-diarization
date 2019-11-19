import { Module, HttpModule } from '@nestjs/common';
import { DiarizationBetaController } from './controllers/diarization-beta/diarization-beta.controller';
import { DiarizationSpeakerService } from './services/diarization-speaker/diarization-speaker.service';
import { GoogleSpeakerDiarizationEventHandlerService } from './event-handler/google-speaker-diarization-event-handler/google-speaker-diarization-event-handler.service';
import { InitiateDiarizationHandlerService } from './event-handler/services/initiate-diarization-handler/initiate-diarization-handler.service';
import { WriteConvertedDataToJsonService } from './event-handler/services/write-converted-data-to-json/write-converted-data-to-json.service';
import { GcloudTokenProviderService } from '../automate-access-token/services/gcloud-token-provider/gcloud-token-provider.service';
import { AccessTokenGeneratorService } from '../automate-access-token/services/access-token-generator/access-token-generator.service';
import { GcsBucketFetcherService } from './services/gcs-bucket-fetcher/gcs-bucket-fetcher.service';

@Module({
    imports: [HttpModule],
    controllers: [DiarizationBetaController],
    providers: [DiarizationSpeakerService, InitiateDiarizationHandlerService, GoogleSpeakerDiarizationEventHandlerService, WriteConvertedDataToJsonService, GcloudTokenProviderService, AccessTokenGeneratorService,GcsBucketFetcherService],
})
export class GoogleSpeakerDiarizationModule {
}
