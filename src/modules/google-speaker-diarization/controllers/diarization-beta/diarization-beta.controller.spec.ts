import { Test, TestingModule } from '@nestjs/testing';
import { DiarizationBetaController } from './diarization-beta.controller';

describe('DiarizationBeta Controller', () => {
  let controller: DiarizationBetaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiarizationBetaController],
    }).compile();

    controller = module.get<DiarizationBetaController>(DiarizationBetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
