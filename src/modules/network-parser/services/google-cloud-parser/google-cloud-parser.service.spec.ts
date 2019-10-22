import { Test, TestingModule } from '@nestjs/testing';
import { GoogleCloudParserService } from './google-cloud-parser.service';

describe('GoogleCloudParserService', () => {
  let service: GoogleCloudParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleCloudParserService],
    }).compile();

    service = module.get<GoogleCloudParserService>(GoogleCloudParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
