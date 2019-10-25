// tslint:disable: variable-name
import { Injectable } from '@nestjs/common';
import {EventEmitter} from 'events';
import { InitiateDiarizationHandlerService } from './../services/initiate-diarization-handler/initiate-diarization-handler.service';
// private initiateDiarizationSrvc: InitiateDiarizationHandlerService
@Injectable()
export class GoogleSpeakerDiarizationEventHandlerService {

    private _mainEmitter = new EventEmitter();
    private _allowedEvents = ['INITIATE_DIARIZATION'];
    // private initiateDiarizationSrvc = new InitiateDiarizationHandlerService();

    constructor(private initiateDiarizationSrvc: InitiateDiarizationHandlerService) {
        console.log('google-speaker-diarization-event-handler active');
        this.handleEvents();
    }

    handleEvents() {
        this._mainEmitter.on('INITIATE_DIARIZATION', (dataToSend) => {
            console.log('acknowledging the main event INITIATE_DIARIZATION');
            this.initiateDiarizationSrvc.initiate(dataToSend.data);
        });
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
