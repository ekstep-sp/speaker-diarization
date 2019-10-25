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
            console.log('timestamp ->', new Date());
            const res = await this.diarizationSpkSrvc.checkStatusFromDiarizationID(diarizationID);

            if (res.hasOwnProperty('error')) {
                console.log(`\nAn error occured while reading status of diarization id ${diarizationID} . Error : ${res.error.message} \n status : ${res.error.response.status}`);
                global.clearInterval(iterator);
            } else {
                this.checkStatusAndProceed(res.resp.data, diarizationID, iterator);
            }
        }, 5000);

    }

    checkStatusAndProceed(response, diarizationID, globalIteratorID) {
        // to check if the status has changed from pending / progress to complete / error
        if (response.name === diarizationID) {
            if (response.metadata.hasOwnProperty('progressPercent')) {
                if (response.metadata.progressPercent == 100 && response.hasOwnProperty('done') && response.done ===  true) {
                    // call ahead
                    global.clearInterval(globalIteratorID);
                    console.log('\ncompleted...');
                    this.sendTranscribedAudio(response.response.results);
                }
                console.log(`\nTotal ${response.metadata.progressPercent}% complete....`);
            } else {
                console.log('0% complete...');
            }
        }
    }

    sendTranscribedAudio(data) {
        console.log('data recieved is ', data.length);
        // initiate the process to remove noise and convert data

    }
}
