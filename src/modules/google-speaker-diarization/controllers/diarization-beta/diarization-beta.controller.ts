import { Controller, Post, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { DiarizationSpeakerService } from '../../services/diarization-speaker/diarization-speaker.service';

@Controller('diarization-beta')
export class DiarizationBetaController {
    constructor(private diazSrvc: DiarizationSpeakerService) { }

    @Post('speaker/longrunningrecogize')
    async initialteLongRunningDiarization(@Res() response: Response, @Body() body): Promise<any> {
        console.log('POST : diarization-beta/speaker/longrunningrecogize');
        // get the request details based on data provided
        const requestDetails = await this.diazSrvc.getDiarizationRequestData(body);
        if (!!requestDetails) {
            console.log('request details created as ', requestDetails);
            // hit the official url and wait for response
            const diarizationIDResponse = await this.diazSrvc.initiateDiarization(requestDetails, body);

            if (diarizationIDResponse.hasOwnProperty('error')) {
                response.status(diarizationIDResponse.status).send({ error: diarizationIDResponse.error });
            } else if (diarizationIDResponse.hasOwnProperty('response')) {
                response.status(200).send(diarizationIDResponse);
            }
        } else {
            response.status(400).send({ error: 'file uri not provided, cannot initiate diarization' });
        }
    }
}
