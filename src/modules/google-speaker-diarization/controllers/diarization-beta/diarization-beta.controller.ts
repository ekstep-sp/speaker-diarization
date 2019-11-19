import { Controller, Post, Res, Body, Get, Query, Param } from '@nestjs/common';
import { Response } from 'express';
import { DiarizationSpeakerService } from '../../services/diarization-speaker/diarization-speaker.service';
import { AccessTokenGeneratorService } from '../../../automate-access-token/services/access-token-generator/access-token-generator.service';
import { GcsBucketFetcherService } from '../../services/gcs-bucket-fetcher/gcs-bucket-fetcher.service';

import { DatabseCommonService } from '../../../read-db/services/database-common-service/databse-common/databse-common.service';

interface DIARIZATION_REQUEST_INTERFACE {
    fileUri: string;
    encoding?: string;
    language?: string;
    enableSpeakerDiarization?: boolean;
    diarizationSpeakerCount?: number;
    model?: string;
    bearer?: string;
}

@Controller('diarization-beta')
export class DiarizationBetaController {
    constructor(
        private diazSrvc: DiarizationSpeakerService,
        private atgSrvc: AccessTokenGeneratorService,
        private gcsSrvc: GcsBucketFetcherService,
        private databaseCommSrvc: DatabseCommonService) { }

    @Post('speaker/longrunningrecogize')
    async initialteLongRunningDiarization(@Res() response: Response, @Body() body): Promise<any> {
        console.log('POST : diarization-beta/speaker/longrunningrecogize');
        // get the request details based on data provided
        return this.handleRequest(response, body);
    }

    @Get('check-status/:diarizationID')
    async checkStatus(@Param() params, @Res() response: Response): Promise<any> {
        console.log('GET: diarization/check-status, for ', params.diarizationID);
        if (this.validateDiarizationID(params.diarizationID)) {
            console.log('diarization id supplied seems syntactically correct');
            return this.checkDiarizationStatusFromID(response, params);
        } else {
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
            // hit the official url and wait for response
            const diarizationIDResponse = await this.diazSrvc.initiateDiarization(requestDetails, body);
            if (diarizationIDResponse.hasOwnProperty('error')) {
                // check for unauthorized access
                if (diarizationIDResponse.status.toString() === '401') {
                    console.log('token has expired, refreshing the token');
                    console.log('sending refresh code request at ', new Date().toTimeString());
                    const isRefreshed = await this.atgSrvc.refreshAuthKey();
                    if (isRefreshed) {
                        console.log('sending handleRequest request at ', new Date().toTimeString());
                        return this.handleRequest(response, body);
                    } else {
                        console.log('unable to refresh auth key for gcloud, check manually');
                        response.status(diarizationIDResponse.status).send({ error: diarizationIDResponse.error });
                    }
                }
                response.status(diarizationIDResponse.status).send({ error: diarizationIDResponse.error });
            } else if (diarizationIDResponse.hasOwnProperty('response')) {
                response.status(200).send(diarizationIDResponse);
            }
        } else {
            response.status(400).send({ error: 'file uri not provided, cannot initiate diarization' });
        }
    }

    async checkDiarizationStatusFromID(response, params): Promise<any> {
        const res = await this.diazSrvc.checkStatusFromDiarizationID(params.diarizationID);

        if (!!res) {
            if (res.hasOwnProperty('error')) {
                if (res.error.response.status.toString() === '401') {
                    console.log('token expired for polling, refreshing the token');
                    const isRefreshed = await this.atgSrvc.refreshAuthKey();
                    if (isRefreshed) {
                        console.log('sending checkDiarizationStatusFromID requestafter refresh at ', new Date().toTimeString());
                        return this.checkDiarizationStatusFromID(response, params);
                    } else {
                        console.log('unable to refresh auth key for gcloud, check manually');
                        response.status(res.error.response.status).send({ error: res.error.message });
                    }
                }
                return response.status(res.error.response.status).send({ error: res.error.message });
            }
            return response.status(200).send({ ...res.resp.data });
        } else {
            return response.status(400).send({ error: 'Malformed or invalid diarization id provided' });
        }
    }

    @Post('speaker/longrunningrecogize2')
    async initialteLongRunningDiarizationWithMultipleFiles(@Res() response: Response, @Body() body): Promise<any> {
        console.log('POST : diarization-beta/speaker/longrunningrecogize2');
        // get the request details based on data provided

        const cloudFilesMetaData = await this.gcsSrvc.getBucketFilesMetaData(body.name);
        console.log('Bucket Files Metadata: ', cloudFilesMetaData['data']);
        const diarizationIds = [];
        const fileAllData = [];

        if (cloudFilesMetaData['data'].hasOwnProperty('data')) {
            if (cloudFilesMetaData['data']['data'].length <= 0) {
                console.log('no data length recieved');
                response.status(400).send({ status: 400, folderName: body.name, error: 'either folder specified or files inside it are not present' });
            } else {
                const filesMetaData = cloudFilesMetaData['data']['data'];

                for (let i = 0; i < filesMetaData.length; i++) {
                    fileAllData[i] = filesMetaData[i];
                    const fileUri = filesMetaData[i]['uri'];

                    const requestBody: any = {};
                    requestBody['fileUri'] = fileUri;
                    requestBody['enableSpeakerDiarization'] = true;
                    requestBody['diarizationSpeakerCount'] = 1;
                    const diarizationIDResponse = await this.handleMultiFilesRequest(response, requestBody);
                    console.log('Diarization Id as Response : ' + diarizationIDResponse['response']['data']['process_id']);
                    fileAllData[i]['diarizationResponse'] = diarizationIDResponse['response']['data'];
                    // console.log('diarizationResponse : ',JSON.stringify(diarizationIDResponse));
                    diarizationIds.push(diarizationIDResponse['response']['data']['process_id']);

                }

                console.log('Diarization Ids : ' + diarizationIds);
                const diarizationIDResponse = { diarizationIds };

                this.trackDiarizationStatus(fileAllData);
                response.status(200).send(diarizationIDResponse);
            }
        }  else  {
            response.status(500).send({ error: 'data key missing from google cloud function response: ', cloudFilesMetaData });
        }

    }

    async handleMultiFilesRequest(response, body) {
        console.log('recieved handleRequest request at ', new Date().toTimeString());
        const requestDetails = await this.diazSrvc.getDiarizationRequestData(body);
        console.log('Request Details : ', requestDetails);
        if (!!requestDetails) {
            console.log('request details created as ', requestDetails);
            // hit the official url and wait for response
            const diarizationIDResponse = await this.diazSrvc.initiateDiarizationOnly(requestDetails, body);
            if (diarizationIDResponse.hasOwnProperty('error')) {
                // check for unauthorized access
                if (diarizationIDResponse.status.toString() === '401') {
                    console.log('token has expired, refreshing the token');
                    console.log('sending refresh code request at ', new Date().toTimeString());
                    const isRefreshed = await this.atgSrvc.refreshAuthKey();
                    if (isRefreshed) {
                        console.log('sending handleRequest request at ', new Date().toTimeString());
                        return this.handleMultiFilesRequest(response, body);
                    } else {
                        console.log('unable to refresh auth key for gcloud, check manually');
                        response.status(diarizationIDResponse.status).send({ error: diarizationIDResponse.error });
                    }
                }
                response.status(diarizationIDResponse.status).send({ error: diarizationIDResponse.error });
            } else if (diarizationIDResponse.hasOwnProperty('response')) {
                return diarizationIDResponse;
            }
        } else {
            response.status(400).send({ error: 'file uri not provided, cannot initiate diarization' });
        }

    }

    trackDiarizationStatus(allFilesData) {

        // Create 1 object with iterator for Each ID'S status and Json response
        //
        const checkStatus = {};
        const iterator = [];
        for (let i = 0; i < allFilesData.length; i++) {
            ( function(thisRef, i, allFilesData) {
                const diarizationProcessId = allFilesData[i]['diarizationResponse']['process_id'];
                checkStatus[diarizationProcessId] = {
                    status: 0,
                };

                // iterator[i] = global.setInterval(this.asyncTimeout(checkStatus), 5000);
                // this.asyncTimeout(checkStatus, diarizationProcessId)
                console.log('timestamp ->', new Date());
                checkStatus[diarizationProcessId]['intervalId'] = setInterval(() => {
                    thisRef.gcsSrvc.initiate2(diarizationProcessId).then(function(response) {
                        if (response === -1) {
                            console.log('\nAn error occured while reading status of diarization id : ' + diarizationProcessId);
                            // global.clearInterval(iterator[i]);
                            checkStatus[diarizationProcessId]['status'] = 2;
                        } else if (response === 0) {

                        } else {
                            checkStatus[diarizationProcessId]['status'] = 1;
                            allFilesData[i]['diarized_data'] = response;
                            console.log('AllFilesData : ', allFilesData);
                            global.clearInterval(checkStatus[diarizationProcessId]['intervalId']);

                            const diarizationIds = Object.keys(checkStatus);
                            let check = false;
                            // console.log(diarizationIds);
                            diarizationIds.forEach(element => {
                                const status = checkStatus[element]['status'];
                                // console.log('status : ',status);
                                if (status === 0) {
                                check = true;
                                }
                            });
                            console.log('Check : ', check);
                            if (!check) {
                                console.log('calling write files to json db');
                                thisRef.databaseCommSrvc.writeFilesToDiarizationDB({data: allFilesData});
                            }

                            console.log('Process Completed for ID : ', diarizationProcessId);
                            // global.clearInterval(iterator[i]);

                        }
                        // console.log("data : ", checkStatus)
                    });
                }, 5000);

            })(this, i, allFilesData);

        }
    }

}
