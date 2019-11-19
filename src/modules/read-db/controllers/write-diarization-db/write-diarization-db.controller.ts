import { Controller, Post, Body, Res } from '@nestjs/common';
import {Response} from 'express';
import { DatabseCommonService } from '../../services/database-common-service/databse-common/databse-common.service';

@Controller('write-diarization-db')
export class WriteDiarizationDbController {

    constructor(private dcSrvc: DatabseCommonService) {}

    @Post('multiple-speaker-diarization')
    async readDBfromJSON(@Body() reqBody: any, @Res() response: Response): Promise<any> {
        // validate the body
        console.log('API hit POST /write-diarization-db/multiple-speaker-diarization');
        const filesWritten = await this.dcSrvc.writeFilesToDiarizationDB(reqBody);

        if (filesWritten.ok) {
            console.log('files written successfully');
            // files written successfully, now trigger the read mechanism
            response.status(200).send({status: 200, message: 'files written successfully'});

        } else {
            console.log('An error occured while executing writeFilesToDiarization ');
            console.log(filesWritten.error);
            response.status(filesWritten['status'] || 500).send({status: filesWritten['status'] || 500, error: filesWritten.error});
        }
    }
}
