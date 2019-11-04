import { Request, Response } from 'express';
import { GcRawService } from '../../services/gc-raw/gc-raw.service';
export declare class GcRawToJsonController {
    private gcRawSrvc;
    constructor(gcRawSrvc: GcRawService);
    parseGCtoJSON(request: Request, response: Response, body: any): void;
}
