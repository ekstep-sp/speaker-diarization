import { Test, TestingModule } from '@nestjs/testing';
import { WriteConvertedDataToJsonService } from './write-converted-data-to-json.service';

describe('WriteConvertedDataToJsonService', () => {
  let service: WriteConvertedDataToJsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WriteConvertedDataToJsonService],
    }).compile();

    service = module.get<WriteConvertedDataToJsonService>(WriteConvertedDataToJsonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
