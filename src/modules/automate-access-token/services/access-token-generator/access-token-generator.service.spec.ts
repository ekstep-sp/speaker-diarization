import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenGeneratorService } from './access-token-generator.service';

describe('AccessTokenGeneratorService', () => {
  let service: AccessTokenGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessTokenGeneratorService],
    }).compile();

    service = module.get<AccessTokenGeneratorService>(AccessTokenGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
