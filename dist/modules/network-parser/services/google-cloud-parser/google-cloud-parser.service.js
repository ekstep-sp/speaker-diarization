"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const common_request_validator_service_1 = require("../../../../services/shared/common-request-validator/common-request-validator.service");
let GoogleCloudParserService = class GoogleCloudParserService {
    constructor(commonReqValidatorSrvc) {
        this.commonReqValidatorSrvc = commonReqValidatorSrvc;
        this.HUB = 'hub';
        this.SPOKE = 'spoke';
    }
    addSpeakerWithTypeToList(speakerTag, speakersObject) {
        speakerTag = speakerTag.toString();
        if (Object.keys(speakersObject).length === 0) {
            speakersObject[speakerTag] = { pid: speakerTag, type: this.HUB };
        }
        else {
            if (Object.keys(speakersObject).indexOf(speakerTag) === -1) {
                speakersObject[speakerTag] = { pid: speakerTag, type: this.SPOKE };
            }
        }
        return speakersObject;
    }
    processSequenceForPreviousSpeaker(sentenceSequenceArray) {
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
    mergeDurationAndSpeakers(durationSequenceArray, speakerCollection) {
        const finalDataArray = [];
        durationSequenceArray.forEach((nodeDuration, index) => {
            const preparedObject = {};
            const speakerTag = Object.entries(nodeDuration)[0][0];
            const speakerDuration = parseFloat(Object.entries(nodeDuration)[0][1]);
            preparedObject['pid'] = speakerTag;
            preparedObject['pname'] = `Speaker_${speakerTag}`;
            Object.keys(speakerCollection).forEach((key) => {
                if (key === preparedObject['pid']) {
                    preparedObject['ptype'] = speakerCollection[key].type;
                }
            });
            preparedObject['dio'] = Math.round(speakerDuration).toString();
            preparedObject['ci_graph'] = '1';
            preparedObject['vs'] = Math.floor(Math.random() * Math.floor(2));
            preparedObject['id'] = index + 1;
            finalDataArray.push(preparedObject);
        });
        return finalDataArray;
    }
    addCDOIforSpeakers(processedDataObject) {
        const cdoiCollection = {};
        processedDataObject.forEach((sequenceObject, index) => {
            if (index === 0) {
                cdoiCollection[sequenceObject.pname] = parseInt(sequenceObject.dio, 10);
            }
            else {
                if (Object.keys(cdoiCollection).indexOf(sequenceObject.pname) > -1) {
                    cdoiCollection[sequenceObject.pname] = parseInt(cdoiCollection[sequenceObject.pname], 10) + parseInt(sequenceObject.dio, 10);
                }
                else {
                    cdoiCollection[sequenceObject.pname] = parseInt(sequenceObject.dio, 10);
                }
            }
            processedDataObject[index]['cdoi'] = cdoiCollection[sequenceObject.pname];
        });
        return processedDataObject;
    }
    addIAforSpeakers(processedDataObject) {
        processedDataObject.map((sequenceObject, index) => {
            let previousSpeaker = {};
            if (index === 0) {
                sequenceObject['ia'] = null;
            }
            else {
                previousSpeaker = processedDataObject[index - 1];
                sequenceObject['ia'] = previousSpeaker['pid'];
            }
            return sequenceObject;
        });
        return processedDataObject;
    }
    async processDataForGoogleCloud(dataToProcess) {
        if (!!dataToProcess && dataToProcess.constructor === Object && Object.keys(dataToProcess).length > 0 &&
            dataToProcess.hasOwnProperty('data')) {
            if (dataToProcess.data.length > 0) {
                let speakerCollection = {};
                let sentenceSequenceArray = [];
                let previousSpeaker = '';
                const processedDataObject = {};
                const durationSequenceArray = [];
                dataToProcess.data.forEach((wordObject, index) => {
                    const currentSpeaker = wordObject.words.speaker_tag.toString();
                    speakerCollection = this.addSpeakerWithTypeToList(currentSpeaker, speakerCollection);
                    if (index === 0) {
                        previousSpeaker = currentSpeaker;
                    }
                    if (currentSpeaker === previousSpeaker) {
                        if (index === dataToProcess.data.length - 1) {
                            sentenceSequenceArray = this.pushIntoSequenceArray(wordObject, sentenceSequenceArray);
                            const durationForPreviousSpeaker = this.processSequenceForPreviousSpeaker(sentenceSequenceArray);
                            const newSequenceObj = {};
                            newSequenceObj[previousSpeaker] = durationForPreviousSpeaker;
                            durationSequenceArray.push(newSequenceObj);
                            sentenceSequenceArray = [];
                        }
                    }
                    else {
                        const durationForPreviousSpeaker = this.processSequenceForPreviousSpeaker(sentenceSequenceArray);
                        const newSequenceObj = {};
                        newSequenceObj[previousSpeaker] = durationForPreviousSpeaker;
                        durationSequenceArray.push(newSequenceObj);
                        sentenceSequenceArray = [];
                        previousSpeaker = currentSpeaker;
                    }
                    if (index !== dataToProcess.data.length - 1) {
                        sentenceSequenceArray = this.pushIntoSequenceArray(wordObject, sentenceSequenceArray);
                    }
                });
                processedDataObject['data'] = this.mergeDurationAndSpeakers(durationSequenceArray, speakerCollection);
                processedDataObject['data'] = this.addCDOIforSpeakers(processedDataObject['data']);
                processedDataObject['data'] = this.addIAforSpeakers(processedDataObject['data']);
                return Promise.resolve(processedDataObject);
            }
            else {
                return Promise.resolve({});
            }
        }
        else {
            return Promise.resolve({});
        }
    }
    async parseData(requestObj, response) {
        if (requestObj.headers.hasOwnProperty('content-type') && requestObj.headers['content-type'] === 'application/json') {
            if (this.commonReqValidatorSrvc.validateBodyObject(requestObj.body)) {
                const processedDataGoogleCloud = await this.processDataForGoogleCloud(requestObj.body);
                return response.status(200).send(processedDataGoogleCloud);
            }
            else {
                return response.status(400).send({ error: 'Invalid / empty request body provided' });
            }
        }
        else {
            return response.status(400).send({ error: 'Content-Type is invalid, accepts only json data' });
        }
    }
    async removeNoiseForGoogleCloudResponse(apiResponseData) {
        const uniqueSpeakerArray = [];
        const processedData = [];
        const alternativeArray = apiResponseData.response.results;
        const newData = alternativeArray[alternativeArray.length - 1];
        const dataToProcess = newData['alternatives'][0]['words'];
        let loop = 0;
        while (loop < dataToProcess.length) {
            const wordObject = dataToProcess[loop];
            const lastSpeakerData = [];
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
            }
            else {
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
    async parseData2(requestObj, response) {
        if (requestObj.headers.hasOwnProperty('content-type') && requestObj.headers['content-type'] === 'application/json') {
            if (this.commonReqValidatorSrvc.validateBodyObject(requestObj.body)) {
                const noiseFilteredDataGoogleCloud2 = await this.removeNoiseForGoogleCloudResponse(requestObj.body);
                const processedDataGoogleCloud2 = await this.processDataForGoogleCloud2(noiseFilteredDataGoogleCloud2);
                return response.status(200).send(processedDataGoogleCloud2);
            }
            else {
                return response.status(400).send({ error: 'Invalid / empty request body provided' });
            }
        }
        else {
            return response.status(400).send({ error: 'Content-Type is invalid, accepts only json data' });
        }
    }
    async processDataForGoogleCloud2(dataToProcess) {
        if (!!dataToProcess && dataToProcess.constructor === Object && dataToProcess.hasOwnProperty('data') && dataToProcess.data.hasOwnProperty('words')) {
            if (Array.isArray(dataToProcess.data.words) && dataToProcess.data.words.length > 0) {
                let speakerCollection = {};
                let sentenceSequenceArray = [];
                let previousSpeaker = '';
                const processedDataObject = {};
                const durationSequenceArray = [];
                dataToProcess.data.words.forEach((wordObject, index) => {
                    const currentSpeaker = wordObject.speakerTag.toString();
                    speakerCollection = this.addSpeakerWithTypeToList(currentSpeaker, speakerCollection);
                    if (index === 0) {
                        previousSpeaker = currentSpeaker;
                    }
                    if (currentSpeaker === previousSpeaker) {
                        if (index === dataToProcess.data.words.length - 1) {
                            sentenceSequenceArray = this.pushIntoSequenceArray2(wordObject, sentenceSequenceArray);
                            const durationForPreviousSpeaker = this.processSequenceForPreviousSpeaker(sentenceSequenceArray);
                            const newSequenceObj = {};
                            newSequenceObj[previousSpeaker] = durationForPreviousSpeaker;
                            durationSequenceArray.push(newSequenceObj);
                            sentenceSequenceArray = [];
                        }
                    }
                    else {
                        const durationForPreviousSpeaker = this.processSequenceForPreviousSpeaker(sentenceSequenceArray);
                        const newSequenceObj = {};
                        newSequenceObj[previousSpeaker] = durationForPreviousSpeaker;
                        durationSequenceArray.push(newSequenceObj);
                        sentenceSequenceArray = [];
                        previousSpeaker = currentSpeaker;
                    }
                    if (index !== dataToProcess.data.words.length - 1) {
                        sentenceSequenceArray = this.pushIntoSequenceArray2(wordObject, sentenceSequenceArray);
                    }
                });
                processedDataObject['data'] = this.mergeDurationAndSpeakers(durationSequenceArray, speakerCollection);
                processedDataObject['data'] = this.addCDOIforSpeakers(processedDataObject['data']);
                processedDataObject['data'] = this.addIAforSpeakers(processedDataObject['data']);
                console.log('everything went okay');
                return Promise.resolve(processedDataObject);
            }
            else {
                return Promise.resolve({});
            }
        }
        else {
            return Promise.resolve({ message: 'dataToPRocess validation failed' });
        }
    }
};
GoogleCloudParserService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_request_validator_service_1.CommonRequestValidatorService])
], GoogleCloudParserService);
exports.GoogleCloudParserService = GoogleCloudParserService;
//# sourceMappingURL=google-cloud-parser.service.js.map