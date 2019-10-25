import { Module, HttpModule } from '@nestjs/common';
import { DiarizationBetaController } from './controllers/diarization-beta/diarization-beta.controller';
import { DiarizationSpeakerService } from './services/diarization-speaker/diarization-speaker.service';

@Module({
    imports: [HttpModule],
    controllers: [DiarizationBetaController],
    providers: [DiarizationSpeakerService],
})
export class GoogleSpeakerDiarizationModule {
}
