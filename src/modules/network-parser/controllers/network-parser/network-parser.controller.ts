import { Controller, Post, Req, Res } from '@nestjs/common';
import { GoogleCloudParserService } from '../../services/google-cloud-parser/google-cloud-parser.service';
import {Request, Response} from 'express';

@Controller('network-parser')
export class NetworkParserController {

    constructor(private gcpSrvc: GoogleCloudParserService) {}

    @Post('googlecloud')
    googleCloud(@Req() request: Request, @Res() response: Response): object {
        console.log('POST : network-parser/googlecloud');
        return this.gcpSrvc.parseData(request, response);
    }

}
