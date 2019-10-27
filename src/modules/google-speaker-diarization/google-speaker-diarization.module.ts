import { Module, HttpModule } from '@nestjs/common';
import { DiarizationBetaController } from './controllers/diarization-beta/diarization-beta.controller';
import { DiarizationSpeakerService } from './services/diarization-speaker/diarization-speaker.service';
import { GoogleSpeakerDiarizationEventHandlerService } from './event-handler/google-speaker-diarization-event-handler/google-speaker-diarization-event-handler.service';
import { InitiateDiarizationHandlerService } from './event-handler/services/initiate-diarization-handler/initiate-diarization-handler.service';
import { WriteConvertedDataToJsonService } from './event-handler/services/write-converted-data-to-json/write-converted-data-to-json.service';

@Module({
    imports: [HttpModule],
    controllers: [DiarizationBetaController],
    providers: [DiarizationSpeakerService, InitiateDiarizationHandlerService, GoogleSpeakerDiarizationEventHandlerService, WriteConvertedDataToJsonService],
})
export class GoogleSpeakerDiarizationModule {
}
