import { Test, TestingModule } from '@nestjs/testing';
import { DiarizationSpeakerService } from './diarization-speaker.service';

describe('DiarizationSpeakerService', () => {
  let service: DiarizationSpeakerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiarizationSpeakerService],
    }).compile();

    service = module.get<DiarizationSpeakerService>(DiarizationSpeakerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
