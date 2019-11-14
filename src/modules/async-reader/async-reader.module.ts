import { Module } from '@nestjs/common';
import { GcloudDiarizationOperationTrackerController } from './controller/gcloud-diarization-operation-tracker/gcloud-diarization-operation-tracker.controller';
import { GcloudDiarizationOperationTrackerService } from './services/gcloud-diarization-operation-tracker-service/gcloud-diarization-operation-tracker.service';

@Module({
    controllers: [
        GcloudDiarizationOperationTrackerController,
    ],
    providers: [
        GcloudDiarizationOperationTrackerService,
    ],
})
export class AsyncReaderModule {}
