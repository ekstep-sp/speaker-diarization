import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NetworkParserModule } from './modules/network-parser/network-parser.module';
import { CommonRequestValidatorService } from './services/shared/common-request-validator/common-request-validator.service';
import { GoogleSpeakerDiarizationModule } from './modules/google-speaker-diarization/google-speaker-diarization.module';
import { ReadDbModule } from './modules/read-db/read-db.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  // serve static files in the server
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'static'),
    }),
    NetworkParserModule, 
    GoogleSpeakerDiarizationModule,
    ReadDbModule,
  ],
  controllers: [AppController],
  providers: [AppService, CommonRequestValidatorService],
})
export class AppModule {

}
