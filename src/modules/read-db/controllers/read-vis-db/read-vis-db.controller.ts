import { Controller, Get, Res } from '@nestjs/common';
import {Response} from 'express';
import { DatabseCommonService } from '../../services/database-common-service/databse-common/databse-common.service';

@Controller('read-vis-db')
export class ReadVisDbController {

    constructor(private dbCommonSrvc: DatabseCommonService) {}

    @Get('json')
    async readDBfromJSON(@Res() response: Response): Promise<any> {
        // read data from the json file
        const fileData = this.dbCommonSrvc.readJSONdb();
        response.status(200).send({fileType: 'json', data: JSON.parse(fileData)});
    }
}
