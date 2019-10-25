import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { DiarizationSpeakerService } from '../../../services/diarization-speaker/diarization-speaker.service';

@Injectable()
export class InitiateDiarizationHandlerService {
    constructor(
        @Inject(forwardRef(() => DiarizationSpeakerService))
        private readonly diarizationSpkSrvc: DiarizationSpeakerService,
    ) { }

    initiate(diarizationID) {
        // read the diarization id and keep checking the status for the same
        this.startInititateCallback(diarizationID);
    }

    async startInititateCallback(diarizationID) {

        const iterator = global.setInterval(async () => {
            console.log('watching iterator ->', new Date());
            const res = await this.diarizationSpkSrvc.checkStatusFromDiarizationID(diarizationID);

            if (res.hasOwnProperty('error')) {
                console.log(`\nAn error occured while reading status of diarization id ${diarizationID} . Error : ${res.error.message} \n status : ${res.error.response.status}`);
                global.clearInterval(iterator);
            } else {
                console.log('recieved response as ', res);
            }
        }, 5000);

    }
}
