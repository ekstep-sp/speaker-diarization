import { Module } from '@nestjs/common';
import { NetworkParserController } from './controllers/network-parser/network-parser.controller';
import { GoogleCloudParserService } from './services/google-cloud-parser/google-cloud-parser.service';
import { CommonRequestValidatorService } from '../../services/shared/common-request-validator/common-request-validator.service';
import { ZoomParserService } from './services/zoom-parser/zoom-parser.service';

@Module({
  controllers: [NetworkParserController],
  providers: [GoogleCloudParserService, CommonRequestValidatorService, ZoomParserService],
})
export class NetworkParserModule {}
