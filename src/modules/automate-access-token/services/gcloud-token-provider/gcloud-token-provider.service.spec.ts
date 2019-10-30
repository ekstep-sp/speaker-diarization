import { Test, TestingModule } from '@nestjs/testing';
import { GcloudTokenProviderService } from './gcloud-token-provider.service';

describe('GcloudTokenProviderService', () => {
  let service: GcloudTokenProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GcloudTokenProviderService],
    }).compile();

    service = module.get<GcloudTokenProviderService>(GcloudTokenProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
