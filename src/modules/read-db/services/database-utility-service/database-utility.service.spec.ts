import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseUtilityService } from './database-utility.service';

describe('DatabaseUtilityService', () => {
  let service: DatabaseUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseUtilityService],
    }).compile();

    service = module.get<DatabaseUtilityService>(DatabaseUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
