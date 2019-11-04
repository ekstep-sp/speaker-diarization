import { GoogleCloudParserService } from '../../services/google-cloud-parser/google-cloud-parser.service';
import { Request, Response } from 'express';
export declare class NetworkParserController {
    private gcpSrvc;
    constructor(gcpSrvc: GoogleCloudParserService);
    googleCloud(request: Request, response: Response): Promise<any>;
    googleCloud2(request: Request, response: Response): Promise<any>;
}
