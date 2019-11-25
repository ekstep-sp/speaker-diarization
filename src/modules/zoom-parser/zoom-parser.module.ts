import { Module } from '@nestjs/common';
import { ZoomToVisController } from './controller/zoom-to-vis/zoom-to-vis.controller';
import { ZoomParserCoreService } from './services/zoom-parser-core-service/zoom-parser-core.service';
import { ZoomParserService } from '../network-parser/services/zoom-parser/zoom-parser.service';

@Module({
    controllers: [ZoomToVisController],
    providers: [ZoomParserCoreService, ZoomParserService],
})
export class ZoomParserModule {}
