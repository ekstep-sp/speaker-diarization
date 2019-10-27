import { Controller, Post, Req, Res } from '@nestjs/common';
import { GoogleCloudParserService } from '../../services/google-cloud-parser/google-cloud-parser.service';
import {Request, Response} from 'express';

@Controller('network-parser')
export class NetworkParserController {

    constructor(private gcpSrvc: GoogleCloudParserService) {}

    @Post('googlecloud')
    async googleCloud(@Req() request: Request, @Res() response: Response): Promise<any> {
        console.log('POST : network-parser/googlecloud');
        return await this.gcpSrvc.parseData(request, response);
    }

    @Post('googlecloud2')
    async googleCloud2(@Req() request: Request, @Res() response: Response): Promise<any> {
        console.log('POST : network-parser/googlecloud2');
        return await this.gcpSrvc.parseData2(request, response);
    }

}
