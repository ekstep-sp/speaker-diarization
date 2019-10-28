import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiarizationSpeakerService } from '../../../services/diarization-speaker/diarization-speaker.service';
import { GoogleCloudParserService } from '../../../../network-parser/services/google-cloud-parser/google-cloud-parser.service';
// to remove issue of cirular dependency
import { ModuleRef } from '@nestjs/core';
// access to module event emitter
import { GoogleSpeakerDiarizationEventHandlerService } from '../../google-speaker-diarization-event-handler/google-speaker-diarization-event-handler.service';

@Injectable()
export class InitiateDiarizationHandlerService implements OnModuleInit  {

    gcpSrvc: any;
    diarizationSpkSrvc: any;
    moduleEmitter: any;
    constructor(
        private readonly moduleRef: ModuleRef,
    ) { }

    onModuleInit() {
        this.gcpSrvc = this.moduleRef.get(GoogleCloudParserService, {strict: false});
        this.diarizationSpkSrvc = this.moduleRef.get(DiarizationSpeakerService, {strict: false});
        this.moduleEmitter = this.moduleRef.get(GoogleSpeakerDiarizationEventHandlerService, {strict: false});
    }

    initiate(diarizationID, videoDetailsForVis) {
        // read the diarization id and keep checking the status for the same
        this.startInititateCallback(diarizationID, videoDetailsForVis);
    }

    async startInititateCallback(diarizationID, videoDetailsForVis) {

        const iterator = global.setInterval(async () => {
            console.log('timestamp ->', new Date());
            const res = await this.diarizationSpkSrvc.checkStatusFromDiarizationID(diarizationID);

            if (res.hasOwnProperty('error')) {
                console.log(`\nAn error occured while reading status of diarization id ${diarizationID} . Error : ${res.error.message} \n status : ${res.error.response.status}`);
                global.clearInterval(iterator);
            } else {
                this.checkStatusAndProceed(res.resp.data, diarizationID, iterator, videoDetailsForVis);
            }
        }, 5000);

    }

    checkStatusAndProceed(response, diarizationID, globalIteratorID, videoDetailsForVis) {
        // to check if the status has changed from pending / progress to complete / error
        if (response.name === diarizationID) {
            if (response.metadata.hasOwnProperty('progressPercent')) {
                if (response.metadata.progressPercent.toString() === '100' && response.hasOwnProperty('done') && response.done ===  true) {
                    // call ahead
                    global.clearInterval(globalIteratorID);
                    console.log('\ncompleted...');
                    this.sendTranscribedAudio(response, videoDetailsForVis);
                }
                console.log(`\nTotal ${response.metadata.progressPercent}% complete....`);
            } else {
                console.log('0% complete...');
            }
        }
    }

    async sendTranscribedAudio(responseData, videoDetailsForVis) {
        // initiate the process to remove noise and convert data
        const noiseFilteredDataGoogleCloud2 = await this.gcpSrvc.removeNoiseForGoogleCloudResponse(responseData);
        const processedDataGoogleCloud2 = await this.gcpSrvc.processDataForGoogleCloud2(noiseFilteredDataGoogleCloud2);
        // initiate process to write the data in the file
        // get auth token by typing 'gcloud auth application-default print-access-token' in gcloud in appdata/local/cloud
        this.moduleEmitter.emitter.emit('WRITE_CONVERTED_DATA_TO_JSON', {data: processedDataGoogleCloud2, details: videoDetailsForVis});
    }
}
