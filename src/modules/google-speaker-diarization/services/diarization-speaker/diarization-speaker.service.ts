// tslint:disable: class-name
import { Injectable, HttpService } from '@nestjs/common';
import {GoogleSpeakerDiarizationEventHandlerService} from './../../event-handler/google-speaker-diarization-event-handler/google-speaker-diarization-event-handler.service';

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
    constructor(private httpSrvc: HttpService, private Emitter: GoogleSpeakerDiarizationEventHandlerService) {
    }

    getDiarizationRequestData(dataToUse: DIARIZATION_REQUEST_INTERFACE): object {
        const googleSpeechDiarizationEndpoint = ' https://speech.googleapis.com/v1p1beta1/speech:longrunningrecognize';
        const DefaultAuthorization = 'Bearer  ya29.c.Kl6iB_0Yv7Fjfj5wR-SZF1h5Y9b36jt9Oafi4DH7hpbKoyC8xc_qohNSvzOge-5cT2trtdIwnGJOai_CNJ2YhlcUKqt-5GAsHtkDqwG1OtMWRjNr3hReBEg94mbzXYLC';
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

        this._bearer_token = dataToUse.bearer || DefaultAuthorization;

        const requestConfig = {
            headers: {
                post: {
                    'Authorization': dataToUse.bearer || DefaultAuthorization,
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
        console.log(requestDetails.uri);
        const Response = this.httpSrvc.post(requestDetails.uri, requestDetails.data, requestDetails.requestConfig).toPromise()
        .then((response: any) => {
            // capture the current diarization id and go further
            this.Emitter.triggerEvent('INITIATE_DIARIZATION', {data: response.data.name, body: bodyData});
            return Promise.resolve({response: `Process started successfully for ${response.data.name}`});
        })
        .catch(err => {
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
