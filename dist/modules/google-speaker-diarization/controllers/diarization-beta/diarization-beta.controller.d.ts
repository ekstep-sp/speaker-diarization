import { Response } from 'express';
import { DiarizationSpeakerService } from '../../services/diarization-speaker/diarization-speaker.service';
import { AccessTokenGeneratorService } from '../../../automate-access-token/services/access-token-generator/access-token-generator.service';
import { GcsBucketFetcherService } from '../../services/gcs-bucket-fetcher/gcs-bucket-fetcher.service';
import { DatabseCommonService } from '../../../read-db/services/database-common-service/databse-common/databse-common.service';
export declare class DiarizationBetaController {
    private diazSrvc;
    private atgSrvc;
    private gcsSrvc;
    private databaseCommSrvc;
    constructor(diazSrvc: DiarizationSpeakerService, atgSrvc: AccessTokenGeneratorService, gcsSrvc: GcsBucketFetcherService, databaseCommSrvc: DatabseCommonService);
    initialteLongRunningDiarization(response: Response, body: any): Promise<any>;
    checkStatus(params: any, response: Response): Promise<any>;
    validateDiarizationID(idToValidate: any): boolean;
    handleRequest(response: any, body: any): any;
    checkDiarizationStatusFromID(response: any, params: any): Promise<any>;
    initialteLongRunningDiarizationWithMultipleFiles(response: Response): Promise<any>;
    handleMultiFilesRequest(response: any, body: any): any;
    trackDiarizationStatus(allFilesData: any): void;
}
