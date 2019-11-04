/// <reference types="node" />
import { EventEmitter } from 'events';
import { InitiateDiarizationHandlerService } from './../services/initiate-diarization-handler/initiate-diarization-handler.service';
import { WriteConvertedDataToJsonService } from '../services/write-converted-data-to-json/write-converted-data-to-json.service';
export declare class GoogleSpeakerDiarizationEventHandlerService {
    private initiateDiarizationSrvc;
    private writeConvertedDataToJSONSrvc;
    private _mainEmitter;
    private _allowedEvents;
    constructor(initiateDiarizationSrvc: InitiateDiarizationHandlerService, writeConvertedDataToJSONSrvc: WriteConvertedDataToJsonService);
    handleEvents(): void;
    getVideoDetails(dataToUse: any): {
        video_name: string;
        video_duration: string;
        hubs_name: any[];
        video_held_on: string;
    };
    readonly allowedEvents: string[];
    readonly emitter: EventEmitter;
    triggerEvent(eventName: any, dataToSend?: object): void;
    validateEvent(eventNameToValidate: any): boolean;
}
