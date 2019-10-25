import { Injectable, Inject, forwardRef, OnModuleInit } from '@nestjs/common';
import { DiarizationSpeakerService } from '../../../services/diarization-speaker/diarization-speaker.service';
import { GoogleCloudParserService } from '../../../../network-parser/services/google-cloud-parser/google-cloud-parser.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class InitiateDiarizationHandlerService implements OnModuleInit  {

    gcpSrvc: any;
    diarizationSpkSrvc: any;
    constructor(
        private readonly moduleRef: ModuleRef,
    ) { }

    onModuleInit() {
        this.gcpSrvc = this.moduleRef.get(GoogleCloudParserService, {strict: false});
        this.diarizationSpkSrvc = this.moduleRef.get(DiarizationSpeakerService, {strict: false});
    }

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
                    this.sendTranscribedAudio(response);
                }
                console.log(`\nTotal ${response.metadata.progressPercent}% complete....`);
            } else {
                console.log('0% complete...');
            }
        }
    }

    async sendTranscribedAudio(responseData) {
        console.log('data recieved is ', responseData.response.results.length);
        // initiate the process to remove noise and convert data
        const noiseFilteredDataGoogleCloud2 = await this.gcpSrvc.removeNoiseForGoogleCloudResponse(responseData);
        const processedDataGoogleCloud2 = await this.gcpSrvc.processDataForGoogleCloud2(noiseFilteredDataGoogleCloud2);
        console.log('final converted data is ', processedDataGoogleCloud2);
    }
}
