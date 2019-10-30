import { Controller, Post, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { DiarizationSpeakerService } from '../../services/diarization-speaker/diarization-speaker.service';
import { AccessTokenGeneratorService } from '../../../automate-access-token/services/access-token-generator/access-token-generator.service';

@Controller('diarization-beta')
export class DiarizationBetaController {
    constructor(private diazSrvc: DiarizationSpeakerService, private atgSrvc: AccessTokenGeneratorService) { }

    @Post('speaker/longrunningrecogize')
    async initialteLongRunningDiarization(@Res() response: Response, @Body() body): Promise<any> {
        console.log('POST : diarization-beta/speaker/longrunningrecogize');
        // get the request details based on data provided
        return this.handleRequest(response, body);
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
}
