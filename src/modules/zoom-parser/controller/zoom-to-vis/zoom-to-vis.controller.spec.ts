import { Test, TestingModule } from '@nestjs/testing';
import { ZoomToVisController } from './zoom-to-vis.controller';

describe('ZoomToVis Controller', () => {
  let controller: ZoomToVisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZoomToVisController],
    }).compile();

    controller = module.get<ZoomToVisController>(ZoomToVisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
