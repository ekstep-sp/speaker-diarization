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
const diarization_speaker_service_1 = require("../../../services/diarization-speaker/diarization-speaker.service");
const google_cloud_parser_service_1 = require("../../../../network-parser/services/google-cloud-parser/google-cloud-parser.service");
const core_1 = require("@nestjs/core");
const google_speaker_diarization_event_handler_service_1 = require("../../google-speaker-diarization-event-handler/google-speaker-diarization-event-handler.service");
let InitiateDiarizationHandlerService = class InitiateDiarizationHandlerService {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
        console.log('constructor called');
        this.gcpSrvc = this.moduleRef.get(google_cloud_parser_service_1.GoogleCloudParserService, { strict: false });
    }
    onModuleInit() {
        this.diarizationSpkSrvc = this.moduleRef.get(diarization_speaker_service_1.DiarizationSpeakerService, { strict: false });
        this.moduleEmitter = this.moduleRef.get(google_speaker_diarization_event_handler_service_1.GoogleSpeakerDiarizationEventHandlerService, { strict: false });
    }
    initiate(diarizationID, videoDetailsForVis) {
        this.startInititateCallback(diarizationID, videoDetailsForVis);
    }
    async startInititateCallback(diarizationID, videoDetailsForVis) {
        const iterator = global.setInterval(async () => {
            console.log('timestamp ->', new Date());
            const res = await this.diarizationSpkSrvc.checkStatusFromDiarizationID(diarizationID);
            if (res.hasOwnProperty('error')) {
                console.log(`\nAn error occured while reading status of diarization id ${diarizationID} . Error : ${res.error.message} \n status : ${res.error.response.status}`);
                global.clearInterval(iterator);
            }
            else {
                this.checkStatusAndProceed(res.resp.data, diarizationID, iterator, videoDetailsForVis);
            }
        }, 5000);
    }
    checkStatusAndProceed(response, diarizationID, globalIteratorID, videoDetailsForVis) {
        if (response.name === diarizationID) {
            if (response.metadata.hasOwnProperty('progressPercent')) {
                if (response.metadata.progressPercent.toString() === '100' && response.hasOwnProperty('done') && response.done === true) {
                    global.clearInterval(globalIteratorID);
                    console.log('\ncompleted...');
                    this.sendTranscribedAudio(response, videoDetailsForVis);
                }
                console.log(`\nTotal ${response.metadata.progressPercent}% complete....`);
            }
            else {
                console.log('0% complete...');
            }
        }
    }
    async sendTranscribedAudio(responseData, videoDetailsForVis) {
        console.log('\n\ninside transcribe\n\n', videoDetailsForVis);
        const noiseFilteredDataGoogleCloud2 = await this.gcpSrvc.removeNoiseForGoogleCloudResponse(responseData);
        const processedDataGoogleCloud2 = await this.gcpSrvc.processDataForGoogleCloud2(noiseFilteredDataGoogleCloud2);
        this.moduleEmitter.emitter.emit('WRITE_CONVERTED_DATA_TO_JSON', { data: processedDataGoogleCloud2, details: videoDetailsForVis });
    }
    async sendTranscribedAudio2(responseData, videoDetailsForVis) {
        console.log('transcribe audio 2');
        const noiseFilteredDataGoogleCloud2 = await this.gcpSrvc.removeNoiseForGoogleCloudResponse(responseData);
        const processedDataGoogleCloud2 = await this.gcpSrvc.processDataForGoogleCloud2(noiseFilteredDataGoogleCloud2);
        const eventModuleImporter = this.moduleRef.get(google_speaker_diarization_event_handler_service_1.GoogleSpeakerDiarizationEventHandlerService, { strict: false });
        eventModuleImporter.emitter.emit('WRITE_CONVERTED_DATA_TO_JSON', { data: processedDataGoogleCloud2, details: videoDetailsForVis });
    }
};
InitiateDiarizationHandlerService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], InitiateDiarizationHandlerService);
exports.InitiateDiarizationHandlerService = InitiateDiarizationHandlerService;
//# sourceMappingURL=initiate-diarization-handler.service.js.map