import { Test, TestingModule } from '@nestjs/testing';
import { WriteDiarizationDbController } from './write-diarization-db.controller';

describe('WriteDiarizationDb Controller', () => {
  let controller: WriteDiarizationDbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WriteDiarizationDbController],
    }).compile();

    controller = module.get<WriteDiarizationDbController>(WriteDiarizationDbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
