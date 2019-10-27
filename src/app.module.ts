import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NetworkParserModule } from './modules/network-parser/network-parser.module';
import { CommonRequestValidatorService } from './services/shared/common-request-validator/common-request-validator.service';
import { GoogleSpeakerDiarizationModule } from './modules/google-speaker-diarization/google-speaker-diarization.module';
import { ReadDbModule } from './modules/read-db/read-db.module';

@Module({
  imports: [NetworkParserModule, GoogleSpeakerDiarizationModule, ReadDbModule],
  controllers: [AppController],
  providers: [AppService, CommonRequestValidatorService],
})
export class AppModule {}
