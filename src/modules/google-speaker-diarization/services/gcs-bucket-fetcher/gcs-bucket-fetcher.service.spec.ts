import { Test, TestingModule } from '@nestjs/testing';
import { GcsBucketFetcherService } from './gcs-bucket-fetcher.service';

describe('GcsBucketFetcherService', () => {
  let service: GcsBucketFetcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GcsBucketFetcherService],
    }).compile();

    service = module.get<GcsBucketFetcherService>(GcsBucketFetcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
