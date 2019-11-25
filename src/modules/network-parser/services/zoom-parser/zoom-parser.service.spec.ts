import { Test, TestingModule } from '@nestjs/testing';
import { ZoomParserService } from './zoom-parser.service';

describe('ZoomParserService', () => {
  let service: ZoomParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZoomParserService],
    }).compile();

    service = module.get<ZoomParserService>(ZoomParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
