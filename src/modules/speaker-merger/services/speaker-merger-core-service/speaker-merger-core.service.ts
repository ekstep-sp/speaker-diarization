import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { DatabseCommonService } from '../../../read-db/services/database-common-service/databse-common/databse-common.service';
import { DatabaseUtilityService } from '../../../read-db/services/database-utility-service/database-utility.service';
import { SpeakerMergerUtilityService } from '../speaker-merger-utility-service/speaker-merger-utility.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class SpeakerMergerCoreService {

    private dateToUse = 'Zoom_Call_Fri_15_Nov_2019_10_36_53_GMT';
    private smUtilitySrvc: any;
    constructor(
        private readonly moduleRef: ModuleRef,
        private dbUtilitySrvc: DatabaseUtilityService,
        @Inject(forwardRef(() => DatabseCommonService))
        private dbCommonSrvc: DatabseCommonService,
        ) {
        // console.log('calling speaker merger module service');
        // this.mergeSpeakers(this.dateToUse);
    }

    mergeSpeakers(urlToConsume) {
        // core funtion to start reading files and process
        const fileNames = this.dbCommonSrvc.readDiarizationDB(urlToConsume);
        if (fileNames && fileNames.length > 0) {
            console.log('file names are ', fileNames);
            // process the json files
            this.processJSONFiles(fileNames, urlToConsume);
        } else if (fileNames && fileNames.length === 0) {
            console.log('no files present inside the given directory');
        } else {
            console.log('error reading the files inside specified directory');
        }
    }

    processJSONFiles(fileNamesToConsume, filesLocation) {
        // clean the combined file of the corresponding parent folder before writing new one
        this.dbUtilitySrvc.cleanCombinedFile(filesLocation);
        // pick the json file squentially
        // put them in the new combined file
        // once all the files are entered, pick the combined file
        // sort the entries based on timestamp
        // rewrite the combined file with sorted data
        let iterations = 0;
        let isValidFile = true;
        while (isValidFile === true && iterations < fileNamesToConsume.length ) {

            const currentFileName = fileNamesToConsume[iterations];
            console.log('picking file ', currentFileName);
            if (this.dbUtilitySrvc.isJSONFile(currentFileName)) {
                console.log('file is valid');
                const currentFileContents = this.dbCommonSrvc.readDiarizationFile(currentFileName, filesLocation);
                if (currentFileContents) {
                    // extract the properdata
                    const isDataAppendedProperly = this.dbCommonSrvc.appendToCombinedFile(currentFileName, currentFileContents, filesLocation);
                    if (isDataAppendedProperly) {
                        console.log(`data for file ${currentFileName} added to combined file successfully\n`);
                        iterations += 1;
                    } else {
                        isValidFile = false;
                    }
                } else {
                    console.log('file is empty, cannot proceed further');
                    isValidFile = false;
                }
            } else {
                console.log(`file is not json, won't proceed further`);
                isValidFile = false;
            }
        }
        // time to sort the data
        // only sort if everything went fine till now
        if (isValidFile) {
            console.log('time to sort on timestamp');
            const UtilitySrvc = this.moduleRef.get(SpeakerMergerUtilityService, {strict: false});
            const response = UtilitySrvc.sortCombinedDiarizationData(filesLocation);
            if (response['ok']) {
                console.log('combined file sorted successfully');
            } else {
                console.log(response['error']);
            }
        }
    }
}
