import { Module } from '@nestjs/common';
import { SpeakerMergerCoreService } from './services/speaker-merger-core-service/speaker-merger-core.service';
import { ReadDbModule } from '../read-db/read-db.module';
import { SpeakerMergerUtilityService } from './services/speaker-merger-utility-service/speaker-merger-utility.service';

@Module({
    imports: [
        ReadDbModule,
    ],
    providers: [
        SpeakerMergerCoreService, SpeakerMergerUtilityService,
    ],
})
export class SpeakerMergerModule {}
