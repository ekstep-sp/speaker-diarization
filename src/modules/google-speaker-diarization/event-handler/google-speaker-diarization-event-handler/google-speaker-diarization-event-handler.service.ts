// tslint:disable: variable-name
import { Injectable } from '@nestjs/common';
import {EventEmitter} from 'events';
import { InitiateDiarizationHandlerService } from './../services/initiate-diarization-handler/initiate-diarization-handler.service';
import { WriteConvertedDataToJsonService } from '../services/write-converted-data-to-json/write-converted-data-to-json.service';
// private initiateDiarizationSrvc: InitiateDiarizationHandlerService
@Injectable()
export class GoogleSpeakerDiarizationEventHandlerService {

    private _mainEmitter = new EventEmitter();
    private _allowedEvents = ['INITIATE_DIARIZATION', 'WRITE_CONVERTED_DATA_TO_JSON'];
    // private initiateDiarizationSrvc = new InitiateDiarizationHandlerService();

    constructor(
        private initiateDiarizationSrvc: InitiateDiarizationHandlerService,
        private writeConvertedDataToJSONSrvc: WriteConvertedDataToJsonService,
        ) {
        this.handleEvents();
    }

    handleEvents() {
        this._mainEmitter.on('INITIATE_DIARIZATION', (dataToSend) => {
            console.log('acknowledging the main event INITIATE_DIARIZATION');
            // send the video details seperately
            const videoDetails = this.getVideoDetails(dataToSend);
            this.initiateDiarizationSrvc.initiate(dataToSend.data, videoDetails);
        });

        this._mainEmitter.on('WRITE_CONVERTED_DATA_TO_JSON', (dataToSend) => {
            console.log('acknowledging the main event WRITE_CONVERTED_DATA_TO_JSON');
            this.writeConvertedDataToJSONSrvc.initiate(dataToSend);
        });

    }

    getVideoDetails(dataToUse: any) {
        const currentDate = new Date().toLocaleDateString();
        const videDetailsObject = {
            video_name: '',
            video_duration: '',
            hubs_name: [],
            video_held_on: '',
        };
        if (dataToUse.hasOwnProperty('body') ) {
            if (!!dataToUse.body && dataToUse.body.hasOwnProperty('fileDetails')) {

                videDetailsObject.video_name = dataToUse.body.fileDetails.video_name || `Video ${currentDate}`;
                videDetailsObject.video_duration = dataToUse.body.fileDetails.video_duration || 'NA';
                videDetailsObject.video_held_on = dataToUse.body.fileDetails.video_held_on || '15 Aug 1947';
                videDetailsObject.hubs_name = dataToUse.body.fileDetails.hubs_name || [];
            }
        }
        return videDetailsObject;
    }

    get allowedEvents() {
        return this._allowedEvents;
    }

    get emitter() {
        return this._mainEmitter;
    }

    triggerEvent(eventName, dataToSend?: object) {
        if(this.validateEvent(eventName)) {
            console.log('triggering a new event ', eventName);
            this._mainEmitter.emit(eventName, dataToSend);
        } else {
            console.log(`Event name ${eventName} specified is not allowed`);
        }
    }

    validateEvent(eventNameToValidate): boolean {
        return this.allowedEvents.indexOf(eventNameToValidate) > -1 ? true : false;
    }

}
