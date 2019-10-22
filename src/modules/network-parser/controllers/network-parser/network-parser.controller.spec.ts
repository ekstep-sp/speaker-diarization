import { Test, TestingModule } from '@nestjs/testing';
import { NetworkParserController } from './network-parser.controller';

describe('NetworkParser Controller', () => {
  let controller: NetworkParserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetworkParserController],
    }).compile();

    controller = module.get<NetworkParserController>(NetworkParserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
