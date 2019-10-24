import { Injectable } from '@nestjs/common';
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

@Injectable()
export class GoogleCloudParserService {

    public HUB = 'hub';
    public SPOKE = 'spoke';

    constructor(private commonReqValidatorSrvc: CommonRequestValidatorService) { }

    addSpeakerWithTypeToList(speakerTag: number | string, speakersObject: object): object {
        // convert to string for convinience
        speakerTag = speakerTag.toString();
        // if the speaker tag is not present as keys, it is a new speaker, add its pid else nothing
        if (Object.keys(speakersObject).length === 0) {
            // first speaker, also the HUB
            speakersObject[speakerTag] = { pid: speakerTag, type: this.HUB };
        } else {
            // not the first speaker
            // if the speaker is not present already, add it as a spoke
            if (Object.keys(speakersObject).indexOf(speakerTag) === -1) {
                speakersObject[speakerTag] = { pid: speakerTag, type: this.SPOKE };
            }
        }
        return speakersObject;
    }

    processSequenceForPreviousSpeaker(sentenceSequenceArray: any[]): number {
        let totalDuration = 0;
        sentenceSequenceArray.forEach(sequence => {
            totalDuration += sequence.duration;
        });
        return totalDuration;
    }

    pushIntoSequenceArray2(wordObject, sentenceSequenceArray) {
        const startTimeInSecs = wordObject.startTime.split('s')[0];
        const endTimeInSecs = !isNaN(wordObject.endTime.split('s')[0]) ? wordObject.endTime.split('s')[0] : startTimeInSecs;

        const floatDuration = parseFloat(endTimeInSecs) - parseFloat(startTimeInSecs);
        const sequenceToPush = {
            start: startTimeInSecs,
            end: endTimeInSecs,
            duration: floatDuration,
        };

        sentenceSequenceArray.push(sequenceToPush);
        return sentenceSequenceArray;
    }

    pushIntoSequenceArray(wordObject, sentenceSequenceArray) {
        const startTimeInSecs = wordObject.words.start_time['seconds'];
        const endTimeInSecs = typeof wordObject.words.end_time['seconds'] === 'number' ? wordObject.words.end_time['seconds'] : wordObject.words.start_time['seconds'];
        sentenceSequenceArray.push({
            start: startTimeInSecs,
            end: endTimeInSecs,
            duration: parseInt(endTimeInSecs, 10) - parseInt(startTimeInSecs, 10),
        });
        return sentenceSequenceArray;
    }

    mergeDurationAndSpeakers(durationSequenceArray, speakerCollection: object) {
        const finalDataArray = [];
        // to add the speaker pid, id, ia and return final prepared data
        durationSequenceArray.forEach((nodeDuration, index: number) => {
            const preparedObject = {};
            const speakerTag = Object.entries(nodeDuration)[0][0];
            const speakerDuration = parseFloat(Object.entries(nodeDuration)[0][1] as string);
            preparedObject['pid'] = speakerTag;
            preparedObject['pname'] = `Speaker_${speakerTag}`;

            // find the node type of current node from speakerCollection
            Object.keys(speakerCollection).forEach((key: string) => {
                if (key === preparedObject['pid']) {
                    preparedObject['ptype'] = speakerCollection[key].type;
                }
            });
            // round off the float value of duration
            console.log('speaker duration process for ', speakerTag + ' is ' + speakerDuration);
            preparedObject['dio'] = Math.round(speakerDuration).toString();
            preparedObject['ci_graph'] = '1';
            preparedObject['vs'] = Math.floor(Math.random() * Math.floor(2));   // either of 0 or 1
            preparedObject['id'] = index + 1;
            finalDataArray.push(preparedObject);
        });

        return finalDataArray;
    }

    addCDOIforSpeakers(processedDataObject) {
        // add the cumulative doi for each speaker in the sequence
        const cdoiCollection = {};
        processedDataObject.forEach((sequenceObject, index) => {
            if (index === 0) {
                cdoiCollection[sequenceObject.pname] = parseInt(sequenceObject.dio, 10);
            } else {
                // if the doi is already present for the current speaker
                if (Object.keys(cdoiCollection).indexOf(sequenceObject.pname) > -1) {
                    // there is some entry for this speaker, add its doi
                    cdoiCollection[sequenceObject.pname] = parseInt(cdoiCollection[sequenceObject.pname], 10) + parseInt(sequenceObject.dio, 10);
                } else {
                    // if the doi is not present for the current speaker, add its doi in the cdoiCollection
                    cdoiCollection[sequenceObject.pname] = parseInt(sequenceObject.dio, 10);
                }

            }
            processedDataObject[index]['cdoi'] = cdoiCollection[sequenceObject.pname];
        });
        return processedDataObject;
    }

    addIAforSpeakers(processedDataObject) {
        // add the interaction after value or ia value in the data array
        processedDataObject.map((sequenceObject, index) => {
            let previousSpeaker = {};
            if (index === 0) {
                sequenceObject['ia'] = null;
            } else {
                previousSpeaker = processedDataObject[index - 1];
                // ia is the pid of previous object
                sequenceObject['ia'] = previousSpeaker['pid'];
            }
            return sequenceObject;
        });
        return processedDataObject;
    }

    async processDataForGoogleCloud(dataToProcess: { data: object[] }): Promise<object> {
        if (!!dataToProcess && dataToProcess.constructor === Object && Object.keys(dataToProcess).length > 0 &&
            dataToProcess.hasOwnProperty('data')) {

            // dataToProcess is valid, proceed
            if (dataToProcess.data.length > 0) {
                let speakerCollection = {};
                let sentenceSequenceArray = [];
                let previousSpeaker = '';

                const processedDataObject = {};
                const durationSequenceArray = [];

                // there is some data to work on, start processing

                dataToProcess.data.forEach((wordObject: GCINTERFACE, index: number) => {
                    const currentSpeaker = wordObject.words.speaker_tag.toString();
                    // add a new speaker with the node type --> hub / spoke
                    speakerCollection = this.addSpeakerWithTypeToList(currentSpeaker, speakerCollection);
                    // add the current word in sentence sequence array
                    if (index === 0) {
                        // this is the first speaker
                        previousSpeaker = currentSpeaker;
                    }
                    // as long as one speaker is speaking, join its words
                    if (currentSpeaker === previousSpeaker) {
                        if (index === dataToProcess.data.length - 1) {
                            sentenceSequenceArray = this.pushIntoSequenceArray(wordObject, sentenceSequenceArray);
                            const durationForPreviousSpeaker = this.processSequenceForPreviousSpeaker(sentenceSequenceArray);
                            // save this duration corresponding to speaker_tag
                            const newSequenceObj = {};
                            newSequenceObj[previousSpeaker] = durationForPreviousSpeaker;
                            durationSequenceArray.push(newSequenceObj);

                            sentenceSequenceArray = [];
                        }
                        // sentenceSequenceArray =  this.pushIntoSequenceArray(wordObject, sentenceSequenceArray);
                    } else {
                        // previousSpeaker !== currentSpeaker means, speaker has changed
                        // process the sentenceSequence for previous speaker
                        const durationForPreviousSpeaker = this.processSequenceForPreviousSpeaker(sentenceSequenceArray);
                        // save this duration corresponding to speaker_tag
                        const newSequenceObj = {};
                        newSequenceObj[previousSpeaker] = durationForPreviousSpeaker;
                        durationSequenceArray.push(newSequenceObj);
                        sentenceSequenceArray = [];
                        // update previous speaker with new speaker
                        previousSpeaker = currentSpeaker;
                    }

                    if (index !== dataToProcess.data.length - 1) {
                        sentenceSequenceArray = this.pushIntoSequenceArray(wordObject, sentenceSequenceArray);
                    }

                });

                // once speakerCollection is recieved,
                // create inital version of processed data
                processedDataObject['data'] = this.mergeDurationAndSpeakers(durationSequenceArray, speakerCollection);
                processedDataObject['data'] = this.addCDOIforSpeakers(processedDataObject['data']);
                processedDataObject['data'] = this.addIAforSpeakers(processedDataObject['data']);
                return Promise.resolve(processedDataObject);
            } else {
                return Promise.resolve({});
            }
        } else {
            return Promise.resolve({});
        }
    }
    /**
     * Parses data
     * @description This function will parse the data compatible with network-visulaizer if accessed via googleCloud
     */
    async parseData(requestObj: Request, response: Response) {
        if (requestObj.headers.hasOwnProperty('content-type') && requestObj.headers['content-type'] === 'application/json') {
            // content type is application/json, proceed further
            if (this.commonReqValidatorSrvc.validateBodyObject(requestObj.body)) {
                // body is valid , proceed further
                const processedDataGoogleCloud = await this.processDataForGoogleCloud(requestObj.body);
                return response.status(200).send(processedDataGoogleCloud);
            } else {
                return response.status(400).send({ error: 'Invalid / empty request body provided' });
            }
        } else {
            return response.status(400).send({ error: 'Content-Type is invalid, accepts only json data' });
        }
    }

    /**
     * Removes noise for google cloud response
     * @description Core functionality is to remove noise in the data recieved from the algorithm
     * @param apiResponseData
     * @returns noise for google cloud response
     */
    async removeNoiseForGoogleCloudResponse(apiResponseData: { response: { results: object[] } }): Promise<object> {
        const uniqueSpeakerArray = [];
        const processedData = [];
        const alternativeArray = apiResponseData.response.results;
        const newData = alternativeArray[alternativeArray.length - 1];
        const dataToProcess = newData['alternatives'][0]['words'];
        let loop = 0;
        while (loop < dataToProcess.length) {
            const wordObject = dataToProcess[loop];
            const lastSpeakerData = [];
            // return wordObject.length === 5;
            let checkUniqeness = true;
            uniqueSpeakerArray.forEach((data) => {
                if (wordObject['speakerTag'] === data) {
                    checkUniqeness = false;
                }
            });
            while (loop < dataToProcess.length - 1 && (dataToProcess[loop]['speakerTag'] === dataToProcess[loop + 1]['speakerTag'])) {
                lastSpeakerData.push(dataToProcess[loop]);
                loop++;
            }
            lastSpeakerData.push(dataToProcess[loop]);
            loop++;
            if (checkUniqeness) {
                uniqueSpeakerArray.push(wordObject['speakerTag']);
                lastSpeakerData.forEach((dataEach) => {
                    processedData.push(dataEach);
                });
            } else {
                if (lastSpeakerData.length > 5) {
                    lastSpeakerData.forEach((dataEach) => {
                        processedData.push(dataEach);
                    });
                }
            }
        }
        const processedDataObject = {};
        processedDataObject['data'] = {};
        processedDataObject['data']['words'] = [];
        processedDataObject['data']['words'] = processedData;
        return Promise.resolve(processedDataObject);
    }

    /**
     * Parses data2
     * @description The function is a secondary implementation of the new format for parsing, similar to parseData
     * @param requestObj The request recieved
     * @param response to be sent back
     */
    async parseData2(requestObj: Request, response: Response) {
        if (requestObj.headers.hasOwnProperty('content-type') && requestObj.headers['content-type'] === 'application/json') {
            // content type is application/json, proceed further
            if (this.commonReqValidatorSrvc.validateBodyObject(requestObj.body)) {
                // body is valid , proceed further
                const noiseFilteredDataGoogleCloud2 = await this.removeNoiseForGoogleCloudResponse(requestObj.body);
                const processedDataGoogleCloud2 = await this.processDataForGoogleCloud2(noiseFilteredDataGoogleCloud2);
                return response.status(200).send(processedDataGoogleCloud2);
            } else {
                return response.status(400).send({ error: 'Invalid / empty request body provided' });
            }
        } else {
            return response.status(400).send({ error: 'Content-Type is invalid, accepts only json data' });
        }
    }

    async processDataForGoogleCloud2(dataToProcess: any): Promise<object> {
        // initial validation
        if (!!dataToProcess && dataToProcess.constructor === Object && dataToProcess.hasOwnProperty('data') && dataToProcess.data.hasOwnProperty('words')) {
            console.log('ok');
            // validation passed
            if (Array.isArray(dataToProcess.data.words) && dataToProcess.data.words.length > 0) {
                console.log('real process');
                let speakerCollection = {};
                let sentenceSequenceArray = [];
                let previousSpeaker = '';

                const processedDataObject = {};
                const durationSequenceArray = [];

                // there is some data to work on, start processing

                dataToProcess.data.words.forEach((wordObject: GCINTERFACE2, index: number) => {
                    console.log('current word is ', JSON.stringify(wordObject));
                    const currentSpeaker = wordObject.speakerTag.toString();
                    // add a new speaker with the node type --> hub / spoke
                    speakerCollection = this.addSpeakerWithTypeToList(currentSpeaker, speakerCollection);
                    console.log('speaker collection now is ', speakerCollection);
                    // add the current word in sentence sequence array
                    if (index === 0) {
                        // this is the first speaker
                        previousSpeaker = currentSpeaker;
                        console.log('first speaker');
                    }
                    // as long as one speaker is speaking, join its words
                    if (currentSpeaker === previousSpeaker) {
                        console.log('inside continue speaker logic');
                        if (index === dataToProcess.data.words.length - 1) {
                            console.log('last speaker');
                            sentenceSequenceArray = this.pushIntoSequenceArray2(wordObject, sentenceSequenceArray);
                            const durationForPreviousSpeaker = this.processSequenceForPreviousSpeaker(sentenceSequenceArray);
                            // save this duration corresponding to speaker_tag
                            const newSequenceObj = {};
                            newSequenceObj[previousSpeaker] = durationForPreviousSpeaker;
                            durationSequenceArray.push(newSequenceObj);
                            console.log('duration sequence now is ', durationSequenceArray);
                            sentenceSequenceArray = [];
                        }
                        // sentenceSequenceArray =  this.pushIntoSequenceArray(wordObject, sentenceSequenceArray);
                    } else {
                        console.log('new speaker in sequence');
                        // previousSpeaker !== currentSpeaker means, speaker has changed
                        // process the sentenceSequence for previous speaker
                        const durationForPreviousSpeaker = this.processSequenceForPreviousSpeaker(sentenceSequenceArray);
                        console.log('duration for previous speaker is ', durationForPreviousSpeaker);
                        // save this duration corresponding to speaker_tag
                        const newSequenceObj = {};
                        newSequenceObj[previousSpeaker] = durationForPreviousSpeaker;
                        durationSequenceArray.push(newSequenceObj);
                        console.log('duration sequence array now is ', durationSequenceArray);
                        sentenceSequenceArray = [];
                        // update previous speaker with new speaker
                        previousSpeaker = currentSpeaker;
                    }

                    if (index !== dataToProcess.data.words.length - 1) {
                        console.log('this is a continous speaker not at the end');
                        sentenceSequenceArray = this.pushIntoSequenceArray2(wordObject, sentenceSequenceArray);
                        console.log('duration sequence now is ', durationSequenceArray);
                    }

                });
                // once speakerCollection is recieved,
                // create inital version of processed data
                console.log('final formatting');
                processedDataObject['data'] = this.mergeDurationAndSpeakers(durationSequenceArray, speakerCollection);
                processedDataObject['data'] = this.addCDOIforSpeakers(processedDataObject['data']);
                processedDataObject['data'] = this.addIAforSpeakers(processedDataObject['data']);
                console.log('everything went okay');
                return Promise.resolve(processedDataObject);

            } else {
                // words array did not validate properly
                return Promise.resolve({});
            }
        } else {
            // if validation fails
            return Promise.resolve({ message: 'dataToPRocess validation failed' });
        }
    }
}
