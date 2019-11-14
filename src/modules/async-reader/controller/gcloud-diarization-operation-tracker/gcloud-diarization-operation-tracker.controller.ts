import { Controller, Post, Body, Res } from '@nestjs/common';

import { Response } from 'express';
import { GcloudDiarizationOperationTrackerService } from '../../services/gcloud-diarization-operation-tracker-service/gcloud-diarization-operation-tracker.service';

@Controller('gcloud-diarization-tracker')
export class GcloudDiarizationOperationTrackerController {

    constructor(private gdotSrvc: GcloudDiarizationOperationTrackerService) {}

    @Post('operations')
    async tracOperationsByOperationIDs(@Body() requestBody: object, @Res() response: Response): Promise<any> {
        console.log('gcloud-diarization-tracker/operations hit');
        if (this.gdotSrvc.validateoperationsBody(requestBody)) {
            // body is validated, proceed further
            this.gdotSrvc.startMultipleIDPolling(requestBody['operationIDs']);
            response.status(200).send({status: 200, message: 'operation ids started for polling'});
        } else {
            response.status(400).send({status: 400, message: 'request body is malformed'});
        }
    }

}
