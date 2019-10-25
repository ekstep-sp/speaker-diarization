import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NetworkParserModule } from './modules/network-parser/network-parser.module';
import { CommonRequestValidatorService } from './services/shared/common-request-validator/common-request-validator.service';
import { GoogleSpeakerDiarizationModule } from './modules/google-speaker-diarization/google-speaker-diarization.module';

@Module({
  imports: [NetworkParserModule, GoogleSpeakerDiarizationModule],
  controllers: [AppController],
  providers: [AppService, CommonRequestValidatorService],
})
export class AppModule {}
