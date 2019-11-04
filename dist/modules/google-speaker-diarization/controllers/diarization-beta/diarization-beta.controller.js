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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const diarization_speaker_service_1 = require("../../services/diarization-speaker/diarization-speaker.service");
const access_token_generator_service_1 = require("../../../automate-access-token/services/access-token-generator/access-token-generator.service");
let DiarizationBetaController = class DiarizationBetaController {
    constructor(diazSrvc, atgSrvc) {
        this.diazSrvc = diazSrvc;
        this.atgSrvc = atgSrvc;
    }
    async initialteLongRunningDiarization(response, body) {
        console.log('POST : diarization-beta/speaker/longrunningrecogize');
        return this.handleRequest(response, body);
    }
    async checkStatus(params, response) {
        console.log('GET: diarization/check-status');
        if (this.validateDiarizationID(params.diarizationID)) {
            console.log('is valid');
            return this.checkDiarizationStatusFromID(response, params);
        }
    }
    validateDiarizationID(idToValidate) {
        return (typeof idToValidate === 'string' && idToValidate.length >= 19 && !isNaN(parseInt(idToValidate, 10))) ? true : false;
    }
    async handleRequest(response, body) {
        console.log('recieved handleRequest request at ', new Date().toTimeString());
        const requestDetails = await this.diazSrvc.getDiarizationRequestData(body);
        if (!!requestDetails) {
            console.log('request details created as ', requestDetails);
            const diarizationIDResponse = await this.diazSrvc.initiateDiarization(requestDetails, body);
            if (diarizationIDResponse.hasOwnProperty('error')) {
                if (diarizationIDResponse.status.toString() === '401') {
                    console.log('token has expired, refreshing the token');
                    console.log('sending refresh code request at ', new Date().toTimeString());
                    const isRefreshed = await this.atgSrvc.refreshAuthKey();
                    if (isRefreshed) {
                        console.log('sending handleRequest request at ', new Date().toTimeString());
                        return this.handleRequest(response, body);
                    }
                    else {
                        console.log('unable to refresh auth key for gcloud, check manually');
                        response.status(diarizationIDResponse.status).send({ error: diarizationIDResponse.error });
                    }
                }
                response.status(diarizationIDResponse.status).send({ error: diarizationIDResponse.error });
            }
            else if (diarizationIDResponse.hasOwnProperty('response')) {
                response.status(200).send(diarizationIDResponse);
            }
        }
        else {
            response.status(400).send({ error: 'file uri not provided, cannot initiate diarization' });
        }
    }
    async checkDiarizationStatusFromID(response, params) {
        const res = await this.diazSrvc.checkStatusFromDiarizationID(params.diarizationID);
        if (!!res) {
            if (res.hasOwnProperty('error')) {
                if (res.error.response.status.toString() === '401') {
                    console.log('token expired for polling, refreshing the token');
                    const isRefreshed = await this.atgSrvc.refreshAuthKey();
                    if (isRefreshed) {
                        console.log('sending checkDiarizationStatusFromID request at ', new Date().toTimeString());
                        return this.checkDiarizationStatusFromID(response, params);
                    }
                    else {
                        console.log('unable to refresh auth key for gcloud, check manually');
                        response.status(res.error.response.status).send({ error: res.error.message });
                    }
                }
                return response.status(res.error.response.status).send({ error: res.error.message });
            }
            return response.status(200).send(Object.assign({}, res.resp.data));
        }
        else {
            return response.status(400).send({ error: 'Malformed or invalid diarization id provided' });
        }
    }
};
__decorate([
    common_1.Post('speaker/longrunningrecogize'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiarizationBetaController.prototype, "initialteLongRunningDiarization", null);
__decorate([
    common_1.Get('check-status/:diarizationID'),
    __param(0, common_1.Param()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiarizationBetaController.prototype, "checkStatus", null);
DiarizationBetaController = __decorate([
    common_1.Controller('diarization-beta'),
    __metadata("design:paramtypes", [diarization_speaker_service_1.DiarizationSpeakerService, access_token_generator_service_1.AccessTokenGeneratorService])
], DiarizationBetaController);
exports.DiarizationBetaController = DiarizationBetaController;
//# sourceMappingURL=diarization-beta.controller.js.map