import { Test, TestingModule } from '@nestjs/testing';
import { ZoomParserCoreService } from './zoom-parser-core.service';

describe('ZoomParserCoreService', () => {
  let service: ZoomParserCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZoomParserCoreService],
    }).compile();

    service = module.get<ZoomParserCoreService>(ZoomParserCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
