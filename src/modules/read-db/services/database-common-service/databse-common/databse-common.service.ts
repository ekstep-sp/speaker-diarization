import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import { DatabaseUtilityService } from '../../database-utility-service/database-utility.service';

@Injectable()
export class DatabseCommonService {

    constructor(private dbUtiiltySrvc: DatabaseUtilityService) {}

    public DB_URL = path.resolve(__dirname, './../../../../../assets/vis_db');
    public DIARIZATION_DB_URL = path.resolve(__dirname, './../../../../../assets/diarization_db');
    /**
     * Reads jsondb
     * @description Read the databse from the common json file recorded
     */
    readJSONdb() {
        console.log('reading from file', this.DB_URL);
        const fileUrl = path.join(this.DB_URL, 'vis_db.json');
        const fileData = fs.readFileSync(fileUrl, {encoding: 'utf-8'});
        return fileData;
    }

    readDiarizationDB(sessionFolderName) {
        // check if the directory is present
        const sourceDir = path.join(this.DIARIZATION_DB_URL, sessionFolderName);
        if (fs.existsSync(sourceDir)) {
            console.log('directory exisits');
            // read the files present in it
            const fileNames = this.dbUtiiltySrvc.listFilesInDirectory(sourceDir);
            if (fileNames && fileNames.length > 0) {
                return fileNames;
            } else {
                return [];
            }
        } else {
            console.log('location not found --> ', sourceDir);
            return undefined;
        }
    }

    readDiarizationFile(fileName, directoryName) {
        const url = path.join(this.DIARIZATION_DB_URL, directoryName, fileName);
        console.log('reading ' + url);
        try {
            const fileContents =  fs.readFileSync(url, {encoding: 'utf-8'});
            return fileContents;
        } catch (e) {
            console.log('error occured while reading file ', fileName);
            console.log(e);
            return undefined;
        }
    }


    /**
     * This function will take the file contents and add it to the designated file present in the folder
     * @returns true if to combined file executed successfully, else false
     */
    appendToCombinedFile(currentFileName, currentFileContents, parentFolderName): boolean {
        console.log('current file name is ',currentFileName);
        try {
            const JSONData = JSON.parse(currentFileContents);
            // extract the correct section
            const filteredContent = this.dbUtiiltySrvc.getDiarizationSection(JSONData);
            // write to designated file properly

            const isFilePresent = this.dbUtiiltySrvc.checkOrCreateFile(parentFolderName);
            if (isFilePresent) {
                // directory structure is present, proceed
                console.log('directory structure is present');
                const currentSpeakerName = currentFileName.replace(path.extname(currentFileName), '').trim();
                console.log('current speaker name is ', currentSpeakerName);
                const response = this.dbUtiiltySrvc.writeDiarizationContentsToFile(parentFolderName, filteredContent, currentSpeakerName);
                if (response['ok']) {
                    return true;
                } else {
                    console.log(response['error']);
                    return false;
                }
            } else {
                console.log('Cannot proceed further as some error occured while creating the corresponding directory structure for ', parentFolderName);
                return false;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
