"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const events_1 = require("events");
const initiate_diarization_handler_service_1 = require("./../services/initiate-diarization-handler/initiate-diarization-handler.service");
const write_converted_data_to_json_service_1 = require("../services/write-converted-data-to-json/write-converted-data-to-json.service");
let GoogleSpeakerDiarizationEventHandlerService = class GoogleSpeakerDiarizationEventHandlerService {
    constructor(initiateDiarizationSrvc, writeConvertedDataToJSONSrvc) {
        this.initiateDiarizationSrvc = initiateDiarizationSrvc;
        this.writeConvertedDataToJSONSrvc = writeConvertedDataToJSONSrvc;
        this._mainEmitter = new events_1.EventEmitter();
        this._allowedEvents = ['INITIATE_DIARIZATION', 'WRITE_CONVERTED_DATA_TO_JSON'];
        this.handleEvents();
    }
    handleEvents() {
        this._mainEmitter.on('INITIATE_DIARIZATION', (dataToSend) => {
            console.log('acknowledging the main event INITIATE_DIARIZATION');
            const videoDetails = this.getVideoDetails(dataToSend);
            this.initiateDiarizationSrvc.initiate(dataToSend.data, videoDetails);
        });
        this._mainEmitter.on('WRITE_CONVERTED_DATA_TO_JSON', (dataToSend) => {
            console.log('acknowledging the main event WRITE_CONVERTED_DATA_TO_JSON');
            this.writeConvertedDataToJSONSrvc.initiate(dataToSend);
        });
    }
    getVideoDetails(dataToUse) {
        const currentDate = new Date().toLocaleDateString();
        const videDetailsObject = {
            video_name: '',
            video_duration: '',
            hubs_name: [],
            video_held_on: '',
        };
        if (dataToUse.hasOwnProperty('body')) {
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
    triggerEvent(eventName, dataToSend) {
        if (this.validateEvent(eventName)) {
            console.log('triggering a new event ', eventName);
            this._mainEmitter.emit(eventName, dataToSend);
        }
        else {
            console.log(`Event name ${eventName} specified is not allowed`);
        }
    }
    validateEvent(eventNameToValidate) {
        return this.allowedEvents.indexOf(eventNameToValidate) > -1 ? true : false;
    }
};
GoogleSpeakerDiarizationEventHandlerService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [initiate_diarization_handler_service_1.InitiateDiarizationHandlerService,
        write_converted_data_to_json_service_1.WriteConvertedDataToJsonService])
], GoogleSpeakerDiarizationEventHandlerService);
exports.GoogleSpeakerDiarizationEventHandlerService = GoogleSpeakerDiarizationEventHandlerService;
//# sourceMappingURL=google-speaker-diarization-event-handler.service.js.map