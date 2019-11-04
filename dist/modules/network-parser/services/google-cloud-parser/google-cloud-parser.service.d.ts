import { Request, Response } from 'express';
import { CommonRequestValidatorService } from '../../../../services/shared/common-request-validator/common-request-validator.service';
export interface GCINTERFACE {
    words: {
        start_time: object;
        end_time?: object;
        word: string;
        speaker_tag: number;
    };
}
export interface GCINTERFACE2 {
    startTime: string;
    endTime?: string;
    word: string;
    speakerTag: number;
}
export declare class GoogleCloudParserService {
    private commonReqValidatorSrvc;
    HUB: string;
    SPOKE: string;
    constructor(commonReqValidatorSrvc: CommonRequestValidatorService);
    addSpeakerWithTypeToList(speakerTag: number | string, speakersObject: object): object;
    processSequenceForPreviousSpeaker(sentenceSequenceArray: any[]): number;
    pushIntoSequenceArray2(wordObject: any, sentenceSequenceArray: any): any;
    pushIntoSequenceArray(wordObject: any, sentenceSequenceArray: any): any;
    mergeDurationAndSpeakers(durationSequenceArray: any, speakerCollection: object): any[];
    addCDOIforSpeakers(processedDataObject: any): any;
    addIAforSpeakers(processedDataObject: any): any;
    processDataForGoogleCloud(dataToProcess: {
        data: object[];
    }): Promise<object>;
    parseData(requestObj: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    removeNoiseForGoogleCloudResponse(apiResponseData: {
        response: {
            results: object[];
        };
    }): Promise<object>;
    parseData2(requestObj: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    processDataForGoogleCloud2(dataToProcess: any): Promise<object>;
}
