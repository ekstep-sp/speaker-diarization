import { Response } from 'express';
import { DiarizationSpeakerService } from '../../services/diarization-speaker/diarization-speaker.service';
import { AccessTokenGeneratorService } from '../../../automate-access-token/services/access-token-generator/access-token-generator.service';
export declare class DiarizationBetaController {
    private diazSrvc;
    private atgSrvc;
    constructor(diazSrvc: DiarizationSpeakerService, atgSrvc: AccessTokenGeneratorService);
    initialteLongRunningDiarization(response: Response, body: any): Promise<any>;
    checkStatus(params: any, response: Response): Promise<any>;
    validateDiarizationID(idToValidate: any): boolean;
    handleRequest(response: any, body: any): any;
    checkDiarizationStatusFromID(response: any, params: any): Promise<any>;
}
