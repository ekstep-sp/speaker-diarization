import { Test, TestingModule } from '@nestjs/testing';
import { SpeakerMergerCoreService } from './speaker-merger-core.service';

describe('SpeakerMergerCoreService', () => {
  let service: SpeakerMergerCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeakerMergerCoreService],
    }).compile();

    service = module.get<SpeakerMergerCoreService>(SpeakerMergerCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
