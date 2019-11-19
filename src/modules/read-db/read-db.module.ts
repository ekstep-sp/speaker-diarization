import { Module } from '@nestjs/common';
import { ReadVisDbController } from './controllers/read-vis-db/read-vis-db.controller';
import { DatabseCommonService } from './services/database-common-service/databse-common/databse-common.service';
import { DatabaseUtilityService } from './services/database-utility-service/database-utility.service';
import { WriteDiarizationDbController } from './controllers/write-diarization-db/write-diarization-db.controller';
import { SpeakerMergerCoreService } from '../speaker-merger/services/speaker-merger-core-service/speaker-merger-core.service';

@Module({
    controllers: [ReadVisDbController, WriteDiarizationDbController],
    providers: [DatabseCommonService, DatabaseUtilityService, SpeakerMergerCoreService],
    exports: [DatabseCommonService, DatabaseUtilityService],
})
export class ReadDbModule {}
