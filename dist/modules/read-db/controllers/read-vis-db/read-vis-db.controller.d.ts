import { Response } from 'express';
import { DatabseCommonService } from '../../services/database-common-service/databse-common/databse-common.service';
export declare class ReadVisDbController {
    private dbCommonSrvc;
    constructor(dbCommonSrvc: DatabseCommonService);
    readDBfromJSON(response: Response): Promise<any>;
}
