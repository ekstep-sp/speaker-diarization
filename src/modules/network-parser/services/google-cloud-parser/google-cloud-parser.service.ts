import { Injectable } from '@nestjs/common';
import {Request, Response} from 'express';
import { CommonRequestValidatorService } from '../../../../services/shared/common-request-validator/common-request-validator.service';

@Injectable()
export class GoogleCloudParserService {

    constructor(private commonReqValidatorSrvc: CommonRequestValidatorService) {}

    /**
     * Parses data
     * @description This function will parse the data compatible with network-visulaizer if accessed via googleCloud
     */
    parseData(requestObj: Request, response: Response) {
        if (requestObj.headers.hasOwnProperty('content-type') && requestObj.headers['content-type'] === 'application/json') {
            // content type is application/json, proceed further
            if (this.commonReqValidatorSrvc.validateBodyObject(requestObj.body)) {
                // body is valid , proceed further
                console.log('total words ', requestObj.body.data.length);
                
                return response.sendStatus(200);
            } else {
                return response.status(400).send({error: 'Invalid / empty request body provided'});
            }
        } else {
            return response.status(400).send({error: 'Content-Type is invalid, accepts only json data'});
        }
    }
}
