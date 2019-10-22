import { Test, TestingModule } from '@nestjs/testing';
import { CommonRequestValidatorService } from './common-request-validator.service';

describe('CommonRequestValidatorService', () => {
  let service: CommonRequestValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonRequestValidatorService],
    }).compile();

    service = module.get<CommonRequestValidatorService>(CommonRequestValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
