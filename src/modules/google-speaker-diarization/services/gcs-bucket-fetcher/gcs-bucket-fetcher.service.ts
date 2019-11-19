import { Injectable, HttpService } from '@nestjs/common';
import { GoogleSpeakerDiarizationEventHandlerService } from '../../event-handler/google-speaker-diarization-event-handler/google-speaker-diarization-event-handler.service';
import { GcloudTokenProviderService } from 'src/modules/automate-access-token/services/gcloud-token-provider/gcloud-token-provider.service';
import { DiarizationSpeakerService } from '../diarization-speaker/diarization-speaker.service';

@Injectable()
export class GcsBucketFetcherService {

    private _bearer_token = '';
    private DEFAULT_AUTHORIZATION = '';
    constructor(private httpSrvc: HttpService, private diarizationSpkSrvc: DiarizationSpeakerService) {
    }

    getBucketFilesMetaData(folderName): object {
        const bucketFilesMetaDataUrl = `https://us-central1-speaker-diarization-resource.cloudfunctions.net/testFunc?folderName=${folderName}`;
        // access the default provider token for gcloud

        return this.httpSrvc.get(bucketFilesMetaDataUrl).toPromise();

    }

    initiate2(diarizationID) {
        // read the diarization id and keep checking the status for the same
        return this.startInititateCallback2(diarizationID);
    }

    async startInititateCallback2(diarizationID) {

        // const iterator = global.setInterval(async () => {
        //     console.log('timestamp ->', new Date());
        //     const res = await this.diarizationSpkSrvc.checkStatusFromDiarizationID(diarizationID);

        //     if (res.hasOwnProperty('error')) {
        //         console.log(`\nAn error occured while reading status of diarization id ${diarizationID} . Error : ${res.error.message} \n status : ${res.error.response.status}`);
        //         global.clearInterval(iterator);
        //     } else {
        //         this.checkStatusAndProceed2(res.resp.data, diarizationID, iterator, videoDetailsForVis);
        //     }
        // }, 5000);

        const res = await this.diarizationSpkSrvc.checkStatusFromDiarizationID(diarizationID);
        if (res.hasOwnProperty('error')) {
                console.log(`\nAn error occured while reading status of diarization id ${diarizationID} . Error : ${res.error.message} \n status : ${res.error.response.status}`);
                return -1;
            } else {
                return this.checkStatusAndProceed2(res.resp.data, diarizationID);
            }

    }

    checkStatusAndProceed2(response, diarizationID) {
        // to check if the status has changed from pending / progress to complete / error
        if (response.name === diarizationID) {
            if (response.metadata.hasOwnProperty('progressPercent')) {
                if (response.metadata.progressPercent.toString() === '100' && response.hasOwnProperty('done') && response.done ===  true) {
                    // call ahead
                    // global.clearInterval(globalIteratorID);
                    console.log('\ncompleted... for ', diarizationID);
                    return response;
                    // add logic
                    // this.sendTranscribedAudio(response, videoDetailsForVis);
                }
                console.log(`\nTotal ${response.metadata.progressPercent}% complete.... for ${diarizationID}`);
                return 0;
            } else {
                console.log('0% complete... for ', diarizationID);
                return 0;
            }
        }
    }

}
