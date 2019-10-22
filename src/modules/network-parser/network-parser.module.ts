import { Module } from '@nestjs/common';
import { NetworkParserController } from './controllers/network-parser/network-parser.controller';
import { GoogleCloudParserService } from './services/google-cloud-parser/google-cloud-parser.service';
import { CommonRequestValidatorService } from '../../services/shared/common-request-validator/common-request-validator.service';


@Module({
  controllers: [NetworkParserController],
  providers: [GoogleCloudParserService, CommonRequestValidatorService],
})
export class NetworkParserModule {}
