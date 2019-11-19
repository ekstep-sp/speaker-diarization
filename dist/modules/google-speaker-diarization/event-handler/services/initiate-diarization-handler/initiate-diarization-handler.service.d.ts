import { OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
export declare class InitiateDiarizationHandlerService implements OnModuleInit {
    private readonly moduleRef;
    gcpSrvc: any;
    diarizationSpkSrvc: any;
    moduleEmitter: any;
    constructor(moduleRef: ModuleRef);
    onModuleInit(): void;
    initiate(diarizationID: any, videoDetailsForVis: any): void;
    startInititateCallback(diarizationID: any, videoDetailsForVis: any): Promise<void>;
    checkStatusAndProceed(response: any, diarizationID: any, globalIteratorID: any, videoDetailsForVis: any): void;
    sendTranscribedAudio(responseData: any, videoDetailsForVis: any): Promise<void>;
    sendTranscribedAudio2(responseData: any, videoDetailsForVis: any): Promise<void>;
}
