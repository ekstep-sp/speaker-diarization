// tslint:disable: class-name
import { Injectable, HttpService } from '@nestjs/common';
import {GoogleSpeakerDiarizationEventHandlerService} from './../../event-handler/google-speaker-diarization-event-handler/google-speaker-diarization-event-handler.service';
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

@Injectable()
export class DiarizationSpeakerService {

    private _bearer_token = '';
    constructor(private httpSrvc: HttpService, private Emitter: GoogleSpeakerDiarizationEventHandlerService,
        private tokenProvider: GcloudTokenProviderService) {
    }

    getDiarizationRequestData(dataToUse: DIARIZATION_REQUEST_INTERFACE): object {
        const googleSpeechDiarizationEndpoint = ' https://speech.googleapis.com/v1p1beta1/speech:longrunningrecognize';
        // access the default provider token for gcloud
        const newToken = this.tokenProvider.process_token;
        const DefaultAuthorization = 'Bearer ' + newToken;
        const data = {
            config: {
                encoding: dataToUse.encoding || 'LINEAR16',
                languageCode: dataToUse.language || 'en-US',
                enableSpeakerDiarization: dataToUse.enableSpeakerDiarization ||  true,
                diarizationSpeakerCount: dataToUse.diarizationSpeakerCount ||  10,
                model: dataToUse.model || 'default',
            },
            audio: {
                uri: dataToUse.fileUri || null,
            },
         };

        this._bearer_token = !!dataToUse.bearer ? dataToUse.bearer : DefaultAuthorization;

        const requestConfig = {
            headers: {
                post: {
                    'Authorization': this._bearer_token,
                    'Content-Type': 'application/json',
                },
            },
        };

        if (!data.audio.uri) {
            return null;
        }

        return {uri: googleSpeechDiarizationEndpoint, data, requestConfig};
    }

    initiateDiarization(requestDetails, bodyData): Promise<any> {
        console.log('sending initiate diarization request at ', new Date().toTimeString());
        const Response = this.httpSrvc.post(requestDetails.uri, requestDetails.data, requestDetails.requestConfig).toPromise()
        .then((response: any) => {
            console.log('recieved response from initiate diarization request at ', new Date().toTimeString());
            // capture the current diarization id and go further
            this.Emitter.triggerEvent('INITIATE_DIARIZATION', {data: response.data.name, body: bodyData});
            return Promise.resolve({response: {message: `Process started successfully`, data: {process_id: response.data.name}}});
        })
        .catch(err => {
            console.log('recieved error from initiate diarization request at ', new Date().toTimeString());
            // this.Emitter.triggerEvent('INITIATE_DIARIZATION', {data: '698255031310955052'});
            return Promise.resolve({error: err.message, status: err.response.status});
        });
        return Response;
    }

    async checkStatusFromDiarizationID(id: string): Promise<any> {
        const requestConfig = {
            headers: {
                get: {
                    'Authorization': this._bearer_token,
                    'Content-Type': 'application/json',
                },
            },
        };
        const url = `https://speech.googleapis.com/v1/operations/${id}`;
        const response = await this.httpSrvc.get(url, requestConfig).toPromise()
        .then((resp) => {
            return Promise.resolve({resp});
        })
        .catch(err => {
            return Promise.resolve({error: err});
        });

        return response;
    }

}
