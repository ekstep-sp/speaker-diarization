import { Test, TestingModule } from '@nestjs/testing';
import { ReadVisDbController } from './read-vis-db.controller';

describe('ReadVisDb Controller', () => {
  let controller: ReadVisDbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadVisDbController],
    }).compile();

    controller = module.get<ReadVisDbController>(ReadVisDbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
