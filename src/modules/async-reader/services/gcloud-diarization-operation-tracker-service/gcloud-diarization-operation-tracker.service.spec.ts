import { Test, TestingModule } from '@nestjs/testing';
import { GcloudDiarizationOperationTrackerService } from './gcloud-diarization-operation-tracker.service';

describe('GcloudDiarizationOperationTrackerService', () => {
  let service: GcloudDiarizationOperationTrackerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GcloudDiarizationOperationTrackerService],
    }).compile();

    service = module.get<GcloudDiarizationOperationTrackerService>(GcloudDiarizationOperationTrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
