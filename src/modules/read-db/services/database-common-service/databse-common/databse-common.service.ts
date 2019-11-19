// tslint:disable: class-name
import { Injectable, Inject, forwardRef } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import { DatabaseUtilityService } from '../../database-utility-service/database-utility.service';
import { SpeakerMergerCoreService } from '../../../../speaker-merger/services/speaker-merger-core-service/speaker-merger-core.service';

export interface WRITE_DIARIZED_FILES_INTERFACE {
    data: Array<{diarized_data: any, bucket: string, name: string, uri: string}>;
}

@Injectable()
export class DatabseCommonService {

    constructor(
        private dbUtiiltySrvc: DatabaseUtilityService,
        @Inject(forwardRef(() => SpeakerMergerCoreService))
        private speakerMergerSrvc: SpeakerMergerCoreService) {}

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
                console.log('directory structure is present for ', currentFileName);
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

    /**
     * Writes files to diarization db will recieve the complete google diarized data for n number of files, along with the parent folder name
     */
    writeFilesToDiarizationDB(multipleDiarizationFilesData: WRITE_DIARIZED_FILES_INTERFACE) {
        // new files should be written to /diarization_db/folder_name/ with name file_name
        // corresponding folder_name should be created in the combined folder with one file combined_diarization.json

        // construct proper database url to write
        let totalFilesWritten = 0;
        let folderStructure;
        multipleDiarizationFilesData.data.forEach(fileData => {
            // get the parent folder name,
            // get the file name
            // get the data
            // write the file in parent_folder/filename.json with data
            folderStructure = this.dbUtiiltySrvc.getFolderStruture(fileData.name);

            if (!!folderStructure['parentFolderName']) {
                console.log('folder structure is ', JSON.stringify(folderStructure) + '\n');
                const stringFileData = JSON.stringify(fileData.diarized_data) || '';
                const writeUrl = path.join(this.DIARIZATION_DB_URL, folderStructure['parentFolderName']);
                console.log('write url for file ', folderStructure['fileName'] + ' is ' + writeUrl + '\n\n');
                try {
                    fs.mkdirSync(writeUrl, {recursive: true});
                    const completeFileUrl = path.join(writeUrl, folderStructure['fileName']);
                    console.log('file path now is ', completeFileUrl);
                    fs.writeFileSync(completeFileUrl, stringFileData, {encoding: 'utf-8'});
                    console.log('file written');
                    totalFilesWritten += 1;
                } catch (e) {
                    console.log('error occured while creating directories, ABORT');
                    console.log(e);
                    return {
                        ok: false,
                        error: 'Unexpected error while creating directories',
                    };
                }
            }
        });
        // check if all the files have been written, only then trigger the readfile functionality
        if (totalFilesWritten === multipleDiarizationFilesData.data.length - 1 ) {
            console.log('files written successfully');
            this.speakerMergerSrvc.mergeSpeakers(folderStructure.parentFolderName);
        } else {
            return {
                ok: true,
                error: '',
            };
        }
        return {
            ok: true,
            error: '',
        };
    }
}
