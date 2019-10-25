import { Test, TestingModule } from '@nestjs/testing';
import { GoogleSpeakerDiarizationEventHandlerService } from './google-speaker-diarization-event-handler.service';

describe('GoogleSpeakerDiarizationEventHandlerService', () => {
  let service: GoogleSpeakerDiarizationEventHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleSpeakerDiarizationEventHandlerService],
    }).compile();

    service = module.get<GoogleSpeakerDiarizationEventHandlerService>(GoogleSpeakerDiarizationEventHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
