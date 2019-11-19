import { HttpService } from '@nestjs/common';
import { GoogleSpeakerDiarizationEventHandlerService } from './../../event-handler/google-speaker-diarization-event-handler/google-speaker-diarization-event-handler.service';
import { GcloudTokenProviderService } from '../../../automate-access-token/services/gcloud-token-provider/gcloud-token-provider.service';
interface DIARIZATION_REQUEST_INTERFACE {
    fileUri: string;
    encoding?: string;
    language?: string;
    enableSpeakerDiarization?: boolean;
    diarizationSpeakerCount?: number;
    model?: string;
    bearer?: string;
}
export declare class DiarizationSpeakerService {
    private httpSrvc;
    private Emitter;
    private tokenProvider;
    private _bearer_token;
    private DEFAULT_AUTHORIZATION;
    constructor(httpSrvc: HttpService, Emitter: GoogleSpeakerDiarizationEventHandlerService, tokenProvider: GcloudTokenProviderService);
    getDiarizationRequestData(dataToUse: DIARIZATION_REQUEST_INTERFACE): object;
    initiateDiarization(requestDetails: any, bodyData: any): Promise<any>;
    initiateDiarizationOnly(requestDetails: any, bodyData: any): Promise<any>;
    checkStatusFromDiarizationID(id: string): Promise<any>;
}
export {};
