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
const gcs_bucket_fetcher_service_1 = require("../../services/gcs-bucket-fetcher/gcs-bucket-fetcher.service");
const databse_common_service_1 = require("../../../read-db/services/database-common-service/databse-common/databse-common.service");
let DiarizationBetaController = class DiarizationBetaController {
    constructor(diazSrvc, atgSrvc, gcsSrvc, databaseCommSrvc) {
        this.diazSrvc = diazSrvc;
        this.atgSrvc = atgSrvc;
        this.gcsSrvc = gcsSrvc;
        this.databaseCommSrvc = databaseCommSrvc;
    }
    async initialteLongRunningDiarization(response, body) {
        console.log('POST : diarization-beta/speaker/longrunningrecogize');
        return this.handleRequest(response, body);
    }
    async checkStatus(params, response) {
        console.log('GET: diarization/check-status, for ', params.diarizationID);
        if (this.validateDiarizationID(params.diarizationID)) {
            console.log('diarization id supplied seems syntactically correct');
            return this.checkDiarizationStatusFromID(response, params);
        }
        else {
            console.log('diarizationID invalid');
            response.status(400).send({ status: 400, message: 'diarization id supplied is invalid' });
        }
    }
    validateDiarizationID(idToValidate) {
        return (typeof idToValidate === 'string' && idToValidate.length >= 5 && !isNaN(parseInt(idToValidate, 10))) ? true : false;
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
                        console.log('sending checkDiarizationStatusFromID requestafter refresh at ', new Date().toTimeString());
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
    async initialteLongRunningDiarizationWithMultipleFiles(response) {
        console.log('POST : diarization-beta/speaker/longrunningrecogize2');
        const cloudFilesMetaData = await this.gcsSrvc.getBucketFilesMetaData();
        console.log('Bucket Files Metadata: ', cloudFilesMetaData['data']);
        let diarizationIds = [];
        let fileAllData = [];
        if (cloudFilesMetaData.hasOwnProperty('data')) {
            let filesMetaData = cloudFilesMetaData['data']['data'];
            for (let i = 0; i < filesMetaData.length; i++) {
                fileAllData[i] = filesMetaData[i];
                let fileUri = filesMetaData[i]['uri'];
                let requestBody = {};
                requestBody['fileUri'] = fileUri;
                requestBody['enableSpeakerDiarization'] = true;
                requestBody['diarizationSpeakerCount'] = 1;
                const diarizationIDResponse = await this.handleMultiFilesRequest(response, requestBody);
                console.log("Diarization Id as Response : " + diarizationIDResponse['response']['data']['process_id']);
                fileAllData[i]['diarizationResponse'] = diarizationIDResponse['response']['data'];
                fileAllData[i]['diarizationResponse'] = diarizationIDResponse['response']['data'];
                diarizationIds.push(diarizationIDResponse['response']['data']['process_id']);
            }
            console.log('Diarization Ids : ' + diarizationIds);
            let diarizationIDResponse = { 'diarizationIds': diarizationIds };
            this.trackDiarizationStatus(fileAllData);
            response.status(200).send(diarizationIDResponse);
        }
        else {
            response.status(400).send({ error: 'data key missing from google cloud function response: ', cloudFilesMetaData });
        }
    }
    async handleMultiFilesRequest(response, body) {
        console.log('recieved handleRequest request at ', new Date().toTimeString());
        const requestDetails = await this.diazSrvc.getDiarizationRequestData(body);
        console.log('Request Details : ', requestDetails);
        if (!!requestDetails) {
            console.log('request details created as ', requestDetails);
            const diarizationIDResponse = await this.diazSrvc.initiateDiarizationOnly(requestDetails, body);
            if (diarizationIDResponse.hasOwnProperty('error')) {
                if (diarizationIDResponse.status.toString() === '401') {
                    console.log('token has expired, refreshing the token');
                    console.log('sending refresh code request at ', new Date().toTimeString());
                    const isRefreshed = await this.atgSrvc.refreshAuthKey();
                    if (isRefreshed) {
                        console.log('sending handleRequest request at ', new Date().toTimeString());
                        return this.handleMultiFilesRequest(response, body);
                    }
                    else {
                        console.log('unable to refresh auth key for gcloud, check manually');
                        response.status(diarizationIDResponse.status).send({ error: diarizationIDResponse.error });
                    }
                }
                response.status(diarizationIDResponse.status).send({ error: diarizationIDResponse.error });
            }
            else if (diarizationIDResponse.hasOwnProperty('response')) {
                return diarizationIDResponse;
            }
        }
        else {
            response.status(400).send({ error: 'file uri not provided, cannot initiate diarization' });
        }
    }
    trackDiarizationStatus(allFilesData) {
        let checkStatus = {};
        let iterator = [];
        for (let i = 0; i < allFilesData.length; i++) {
            (function (thisRef, i, allFilesData) {
                let diarizationProcessId = allFilesData[i]['diarizationResponse']['process_id'];
                checkStatus[diarizationProcessId] = {
                    status: 0
                };
                console.log('timestamp ->', new Date());
                checkStatus[diarizationProcessId]["intervalId"] = setInterval(() => {
                    thisRef.gcsSrvc.initiate2(diarizationProcessId).then(function (response) {
                        if (response === -1) {
                            console.log('\nAn error occured while reading status of diarization id : ' + diarizationProcessId);
                            checkStatus[diarizationProcessId]['status'] = 2;
                        }
                        else if (response === 0) {
                        }
                        else {
                            checkStatus[diarizationProcessId]['status'] = 1;
                            allFilesData[i]['diarized_data'] = response;
                            console.log('AllFilesData : ', allFilesData);
                            global.clearInterval(checkStatus[diarizationProcessId]["intervalId"]);
                            let diarizationIds = Object.keys(checkStatus);
                            let check = false;
                            diarizationIds.forEach(element => {
                                let status = checkStatus[element]['status'];
                                if (status === 0) {
                                    check = true;
                                }
                            });
                            console.log('Check : ', check);
                            if (!check) {
                                console.log('calling write files to json db');
                                thisRef.databaseCommSrvc.writeFilesToDiarizationDB({ data: allFilesData });
                            }
                            console.log('Process Completed for ID : ', diarizationProcessId);
                        }
                    });
                }, 5000);
            })(this, i, allFilesData);
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
__decorate([
    common_1.Get('speaker/longrunningrecogize2'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiarizationBetaController.prototype, "initialteLongRunningDiarizationWithMultipleFiles", null);
DiarizationBetaController = __decorate([
    common_1.Controller('diarization-beta'),
    __metadata("design:paramtypes", [diarization_speaker_service_1.DiarizationSpeakerService,
        access_token_generator_service_1.AccessTokenGeneratorService,
        gcs_bucket_fetcher_service_1.GcsBucketFetcherService,
        databse_common_service_1.DatabseCommonService])
], DiarizationBetaController);
exports.DiarizationBetaController = DiarizationBetaController;
//# sourceMappingURL=diarization-beta.controller.js.map