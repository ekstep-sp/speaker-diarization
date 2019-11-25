import { Injectable } from '@nestjs/common';
import { CommonRequestValidatorService } from '../../../../services/shared/common-request-validator/common-request-validator.service';
import { ModuleRef } from '@nestjs/core';
import { GoogleCloudParserService } from '../google-cloud-parser/google-cloud-parser.service';
import { WriteConvertedDataToJsonService } from '../../../google-speaker-diarization/event-handler/services/write-converted-data-to-json/write-converted-data-to-json.service';

@Injectable()
export class ZoomParserService {

    constructor(private readonly moduleRef: ModuleRef) {}

    async parseDataForVis(dataToParse: object): Promise<boolean> {
        console.log('parse data for vis called');
        const videoDetailsToUse = dataToParse['details'] || {};
        // get access to commonRequestValidatorService
        const crValidator = this.moduleRef.get(CommonRequestValidatorService, {strict: false});
        const gcpSrvc = this.moduleRef.get(GoogleCloudParserService, {strict: false});

        const isValid = await crValidator.validateZoomBodyObject(dataToParse);
        if (isValid) {
            // request is validated, now remove noise from the request
            const dataWithSpeakers = await this.settleUnnamedObjects(dataToParse as {data: any});
            const dataWithNewTimes = await this.addNewTimeKeys(dataWithSpeakers as {data: any});
            // call the event handler of writing files to JSOn
            // now send it to the parser which will convert it into vis format
            const dataInParsingFormat = {
                data: {
                    words: dataWithNewTimes.data,
                },
            };
            const processedData = await gcpSrvc.processDataForGoogleCloud2(dataInParsingFormat);
            console.log('processed data is ', processedData);
            // write it in the database
            const wcd2JSONSrvc = this.moduleRef.get(WriteConvertedDataToJsonService, {strict: false});
            console.log('video details to use is ', videoDetailsToUse);
            wcd2JSONSrvc.initiate({details: videoDetailsToUse, data: processedData});
            return Promise.resolve(isValid);
        } else {
            console.log('request body is not validated');
            return Promise.resolve(isValid);
        }
    }

    settleUnnamedObjects(dataToUse: {data: any}) {
        // this function will iterate on all the speaker objects, and if there is an object with no speaker tag
        // simply assign it the previous speaker
        dataToUse.data = dataToUse.data.map((speakerObject, index) => {
            // if the index is 0, assign the next speaker
            if (!speakerObject.hasOwnProperty('speakerTag') && index === 0) {
                // check the first speaker detected after this object and assign its name
                let speakerFound = false;
                let whileIterator = index + 1;
                let speakerNameToUse = '';
                while(!speakerFound && whileIterator <= dataToUse.data.length) {
                    if (dataToUse.data[whileIterator].hasOwnProperty('speakerTag')) {
                        // speaker name found
                        speakerFound = true;
                        speakerNameToUse = dataToUse.data[whileIterator]['speakerTag'];
                        console.log('collected new speaker name as ', speakerNameToUse);
                    } else {
                        whileIterator += 1;
                    }
                }
                if (speakerNameToUse.length > 0) {
                    // there is a speaker name, simply use it for the current object
                    speakerObject['speakerTag'] = speakerNameToUse;
                    console.log('speaker name assign to object ', speakerObject);
                    return speakerObject;
                }
            } else if (!speakerObject.hasOwnProperty('speakerTag')) {
                // there are valid objects above this object, who have speaker name
                // find the speaker above this object and assign its name
                console.log('assigning a new speaker from ', index - 1);
                console.log('name of previous speaker is ', dataToUse.data[index - 1].speakerTag);
                speakerObject['speakerTag'] = dataToUse.data[index - 1].speakerTag;
                console.log('speaker tag assigned to the object ', speakerObject);
                return speakerObject;
            }
            return speakerObject;
        });
        return dataToUse;
    }

    addNewTimeKeys(dataToUse: {data: any}) {
        dataToUse.data = dataToUse.data.map((speakerObject) => {
            return {...speakerObject, startTime: speakerObject.startSeconds + 's', endTime: speakerObject.endSeconds + 's'};
        });
        return dataToUse;
    }

}
