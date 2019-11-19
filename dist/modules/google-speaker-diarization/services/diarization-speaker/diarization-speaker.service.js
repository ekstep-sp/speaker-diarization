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
const google_speaker_diarization_event_handler_service_1 = require("./../../event-handler/google-speaker-diarization-event-handler/google-speaker-diarization-event-handler.service");
const gcloud_token_provider_service_1 = require("../../../automate-access-token/services/gcloud-token-provider/gcloud-token-provider.service");
let DiarizationSpeakerService = class DiarizationSpeakerService {
    constructor(httpSrvc, Emitter, tokenProvider) {
        this.httpSrvc = httpSrvc;
        this.Emitter = Emitter;
        this.tokenProvider = tokenProvider;
        this._bearer_token = '';
        this.DEFAULT_AUTHORIZATION = '';
        this.DEFAULT_AUTHORIZATION = 'Bearer ' + this.tokenProvider.process_token;
    }
    getDiarizationRequestData(dataToUse) {
        const googleSpeechDiarizationEndpoint = ' https://speech.googleapis.com/v1p1beta1/speech:longrunningrecognize';
        const newToken = this.tokenProvider.process_token;
        this.DEFAULT_AUTHORIZATION = 'Bearer ' + newToken;
        const data = {
            config: {
                encoding: dataToUse.encoding || 'LINEAR16',
                languageCode: dataToUse.language || 'en-US',
                enableSpeakerDiarization: dataToUse.enableSpeakerDiarization || true,
                diarizationSpeakerCount: dataToUse.diarizationSpeakerCount || 10,
                model: dataToUse.model || 'video',
            },
            audio: {
                uri: dataToUse.fileUri || null,
            },
        };
        this._bearer_token = !!dataToUse.bearer ? dataToUse.bearer : this.DEFAULT_AUTHORIZATION;
        const requestConfig = {
            headers: {
                post: {
                    'Authorization': this._bearer_token,
                    'Content-Type': 'application/json',
                },
            },
        };
        if (!data.audio.uri) {
            return null;
        }
        return { uri: googleSpeechDiarizationEndpoint, data, requestConfig };
    }
    initiateDiarization(requestDetails, bodyData) {
        console.log('sending initiate diarization request at ', new Date().toTimeString());
        const Response = this.httpSrvc.post(requestDetails.uri, requestDetails.data, requestDetails.requestConfig).toPromise()
            .then((response) => {
            console.log('recieved response from initiate diarization request at ', new Date().toTimeString());
            this.Emitter.triggerEvent('INITIATE_DIARIZATION', { data: response.data.name, body: bodyData });
            return Promise.resolve({ response: { message: `Process started successfully`, data: { process_id: response.data.name } } });
        })
            .catch(err => {
            console.log('recieved error from initiate diarization request at ', new Date().toTimeString());
            console.log(err);
            return Promise.resolve({ error: err.message, status: err.response.status });
        });
        return Response;
    }
    initiateDiarizationOnly(requestDetails, bodyData) {
        console.log('sending initiate diarization request at ', new Date().toTimeString());
        const Response = this.httpSrvc.post(requestDetails.uri, requestDetails.data, requestDetails.requestConfig).toPromise()
            .then((response) => {
            console.log('recieved response from initiate diarization request at ', new Date().toTimeString());
            return Promise.resolve({ response: { message: `Process started successfully`, data: { process_id: response.data.name } } });
        })
            .catch(err => {
            console.log('recieved error from initiate diarization request at ', new Date().toTimeString());
            console.log(err);
            return Promise.resolve({ error: err.message, status: err.response.status });
        });
        return Response;
    }
    async checkStatusFromDiarizationID(id) {
        this.DEFAULT_AUTHORIZATION = 'Bearer ' + this.tokenProvider.process_token;
        const requestConfig = {
            headers: {
                get: {
                    'Authorization': this.DEFAULT_AUTHORIZATION,
                    'Content-Type': 'application/json',
                },
            },
        };
        const url = `https://speech.googleapis.com/v1/operations/${id}`;
        const response = await this.httpSrvc.get(url, requestConfig).toPromise()
            .then((resp) => {
            return Promise.resolve({ resp });
        })
            .catch(err => {
            console.log('error occcured while hitting pol request for diarization ID ' + id, err);
            return Promise.resolve({ error: err });
        });
        return response;
    }
};
DiarizationSpeakerService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService, google_speaker_diarization_event_handler_service_1.GoogleSpeakerDiarizationEventHandlerService,
        gcloud_token_provider_service_1.GcloudTokenProviderService])
], DiarizationSpeakerService);
exports.DiarizationSpeakerService = DiarizationSpeakerService;
//# sourceMappingURL=diarization-speaker.service.js.map