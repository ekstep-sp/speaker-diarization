import { Test, TestingModule } from '@nestjs/testing';
import { GcloudDiarizationOperationTrackerController } from './gcloud-diarization-operation-tracker.controller';

describe('GcloudDiarizationOperationTracker Controller', () => {
  let controller: GcloudDiarizationOperationTrackerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GcloudDiarizationOperationTrackerController],
    }).compile();

    controller = module.get<GcloudDiarizationOperationTrackerController>(GcloudDiarizationOperationTrackerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
