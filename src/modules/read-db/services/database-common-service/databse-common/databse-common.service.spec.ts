import { Test, TestingModule } from '@nestjs/testing';
import { DatabseCommonService } from './databse-common.service';

describe('DatabseCommonService', () => {
  let service: DatabseCommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabseCommonService],
    }).compile();

    service = module.get<DatabseCommonService>(DatabseCommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
