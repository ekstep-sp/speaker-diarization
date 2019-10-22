import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NetworkParserModule } from './modules/network-parser/network-parser.module';
import { CommonRequestValidatorService } from './services/shared/common-request-validator/common-request-validator.service';

@Module({
  imports: [NetworkParserModule],
  controllers: [AppController],
  providers: [AppService, CommonRequestValidatorService],
})
export class AppModule {}
