import { Test, TestingModule } from '@nestjs/testing';
import { InitiateDiarizationHandlerService } from './initiate-diarization-handler.service';

describe('InitiateDiarizationHandlerService', () => {
  let service: InitiateDiarizationHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitiateDiarizationHandlerService],
    }).compile();

    service = module.get<InitiateDiarizationHandlerService>(InitiateDiarizationHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
