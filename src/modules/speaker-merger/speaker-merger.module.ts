import { Module, forwardRef } from '@nestjs/common';
import { SpeakerMergerCoreService } from './services/speaker-merger-core-service/speaker-merger-core.service';
import { ReadDbModule } from '../read-db/read-db.module';
import { SpeakerMergerUtilityService } from './services/speaker-merger-utility-service/speaker-merger-utility.service';
import { GoogleSpeakerDiarizationModule } from '../google-speaker-diarization/google-speaker-diarization.module';
import { InitiateDiarizationHandlerService } from '../google-speaker-diarization/event-handler/services/initiate-diarization-handler/initiate-diarization-handler.service';

@Module({
    imports: [
        GoogleSpeakerDiarizationModule,
        forwardRef(() => ReadDbModule),
    ],
    providers: [
        SpeakerMergerCoreService, SpeakerMergerUtilityService, InitiateDiarizationHandlerService,
    ],
    exports: [SpeakerMergerCoreService],
})
export class SpeakerMergerModule {}
