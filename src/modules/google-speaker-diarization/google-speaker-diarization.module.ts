import { Module, HttpModule } from '@nestjs/common';
import { DiarizationBetaController } from './controllers/diarization-beta/diarization-beta.controller';
import { DiarizationSpeakerService } from './services/diarization-speaker/diarization-speaker.service';
import { GoogleSpeakerDiarizationEventHandlerService } from './event-handler/google-speaker-diarization-event-handler/google-speaker-diarization-event-handler.service';
import { InitiateDiarizationHandlerService } from './event-handler/services/initiate-diarization-handler/initiate-diarization-handler.service';

@Module({
    imports: [HttpModule],
    controllers: [DiarizationBetaController],
    providers: [DiarizationSpeakerService, InitiateDiarizationHandlerService, GoogleSpeakerDiarizationEventHandlerService],
})
export class GoogleSpeakerDiarizationModule {
}
