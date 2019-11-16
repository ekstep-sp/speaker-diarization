import { Test, TestingModule } from '@nestjs/testing';
import { SpeakerMergerUtilityService } from './speaker-merger-utility.service';

describe('SpeakerMergerUtilityService', () => {
  let service: SpeakerMergerUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeakerMergerUtilityService],
    }).compile();

    service = module.get<SpeakerMergerUtilityService>(SpeakerMergerUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
