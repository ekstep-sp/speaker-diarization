import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseUtilityService {

    private DEST_COMPLETE_DIARIZATION_URL = path.resolve(__dirname, './../../../../assets/diarization_db/combined');

    listFilesInDirectory(directoryAddr) {
        try {
            const fileNames = fs.readdirSync(directoryAddr);
            return fileNames;
        } catch (e) {
            console.log('An error occured while reading the files in ' + directoryAddr);
            console.log(e);
            return undefined;
        }
    }

    isJSONFile(fileName) {

        return path.extname(fileName).toLowerCase() === '.json' ? true : false;
    }

    getDiarizationSection(dataToUse) {
        if (dataToUse && dataToUse instanceof Object) {
            if (Object.keys(dataToUse).length > 0 && dataToUse.hasOwnProperty('response')) {
                if (dataToUse.response.hasOwnProperty('results') && Array.isArray(dataToUse.response.results) && dataToUse.response.results.length > 0) {
                    // pick the last alternatives section and store it
                    const diarizedSection = dataToUse.response.results[dataToUse.response.results.length - 1];
                    return diarizedSection;
                } else {
                    // the results key is not present or is empty
                }
            } else {
                // there is no response
            }
        } else {
            // the object is invalid
        }
        return {};
    }

    checkOrCreateFile(parentFolderName, fileNameToUse = 'combined_diarization.json') {
        // check if the parent folder is present, else create one
        // if present, see if the combined_diarization.json is empty
        // if yes, simply write it else append it
        console.log('looking in destination ', this.DEST_COMPLETE_DIARIZATION_URL);

        if (!fs.existsSync(path.join(this.DEST_COMPLETE_DIARIZATION_URL, parentFolderName))) {
            // create the new file in the specified directory
            try {
                fs.mkdirSync(path.join(this.DEST_COMPLETE_DIARIZATION_URL, parentFolderName));
                console.log('folder created by name ', parentFolderName);
            } catch (e) {
                console.log('An error occured while creating a new folder with name ', parentFolderName + ' aborting the process');
                console.log(e);
                return false;
            }
        }
        // now write the contents into the file
        const completeSessionDirectory = path.join(this.DEST_COMPLETE_DIARIZATION_URL, parentFolderName);
        const filesPresent = this.listFilesInDirectory(completeSessionDirectory);
        // check if combined_diarization.json is present or not
        if (filesPresent.indexOf(fileNameToUse) > -1) {
            console.log(fileNameToUse + 'is already present there');
            return true;
        } else {
            // create a new file with the name specified
            console.log('no file with the name ', fileNameToUse + ' present, creating a new one');
            try {
                fs.writeFileSync(path.join(completeSessionDirectory, fileNameToUse), '', {encoding: 'utf-8'});
                console.log('new file created successfully');
                return true;
            } catch (e) {
                console.log('An error occured while creating new file ', fileNameToUse);
                console.log(e);
                return false;
            }
        }
    }

    /**
     * This function will see whether to write or append the data into the provided file and handle process accordingly
     * @param parentFolderName Name of the parent directory inside diarization_db/combined folder
     * @param contentsToWrite Data in JSON format to be written
     * @param [fileNameToUse] Name of the file where the data is to be written, default to combined_diarization.json inside parentFolder
     * @returns an object { ok : true || false, error : < empty string > || < Error Message if ok is false > } stating whether the process terminated successfully or not
     */
    writeDiarizationContentsToFile(parentFolderName, contentsToWrite, currentSpeakerName,  fileNameToUse = 'combined_diarization.json'): object {

        const destFile = path.join(this.DEST_COMPLETE_DIARIZATION_URL, parentFolderName, fileNameToUse);
        try {
            const fileInitialContents = fs.readFileSync(destFile, {encoding: 'utf-8'});
            // some content is already present there
            const newFileContents = this.appendNewDiarizationContent(fileInitialContents, contentsToWrite, currentSpeakerName);
            // simply write this new content into the file

            if (!!newFileContents) {
                const isFileWritten = this.writeDataToFile(newFileContents, destFile);
                if (isFileWritten.ok) {
                    return {
                        ok: true,
                        error: '',
                    };
                } else {
                    return {
                        ok: false,
                        error: isFileWritten.error,
                    };
                }

            } else {
                // since the string is empty, some error has occured
                return {
                    ok: false,
                    error: 'Failed to write data in to the file',
                };
            }
        } catch (e) {
            console.log(e);
            return {
                ok: false,
                error: 'An Error occured while writing contents to your file',
            };
        }

    }

    writeDataToFile(dataStringToWrite, fileAddr) {
        try {
            fs.writeFileSync(fileAddr, dataStringToWrite, {encoding: 'utf-8'});
            return {
                ok: true,
                error: '',
            };
        } catch (e) {
            console.log(e);
            return {
                ok: false,
                error: 'An error occured while writing contents to the file',
            };
        }
    }

    appendNewDiarizationContent(dataPresent, dataToWrite, designatedSpeakerName): string {
        if (dataPresent.length > 0) {
            console.log('creating append object');
            // some data is already present inside the combined file, append properly
            try {
                const parsedData = JSON.parse(dataPresent);
                if (
                    parsedData.hasOwnProperty('response') && parsedData.response.hasOwnProperty('results') &&
                    Array.isArray(parsedData.response.results) && parsedData.response.results.length === 1 &&
                    parsedData.response.results[0].hasOwnProperty('alternatives') && Array.isArray(parsedData.response.results[0].alternatives) &&
                    parsedData.response.results[0].alternatives.length === 1 &&
                    parsedData.response.results[0].alternatives[0].hasOwnProperty('words') && Array.isArray(parsedData.response.results[0].alternatives[0].words)
                    ) {
                    // push this new entry
                    // utility function to update the speaker tag in new data with the speaker name
                    const newDataWithSpeakerName = this.addSpeakerNameInData(designatedSpeakerName, dataToWrite);
                    if (newDataWithSpeakerName !== undefined) {
                        parsedData.response.results[0].alternatives[0].words.push(...newDataWithSpeakerName.alternatives[0].words);
                        console.log('append data object created successfully');
                        return JSON.stringify(parsedData);
                    } else {
                        return '';
                    }
                } else {
                    console.log('format of json object inside the file is malformed');
                    return '';
                }
            } catch (e) {
                console.log('An error occured while creating data object to write in file\n');
                console.log(e);
                return '';
            }
        } else {
            console.log('creating new data object');
            // there is no content in the file, write first set
            const newDataWithSpeakerName = this.addSpeakerNameInData(designatedSpeakerName, dataToWrite);
            const newDataObject = {
                response: {
                    results: [
                        {...newDataWithSpeakerName},
                    ],
                },
            };
            return JSON.stringify(newDataObject);
        }
    }

    cleanSpeakerName(nameToClean2: string) {
        // the function will make the speaker name short if it more than 14 characters
        let nameToClean = nameToClean2;
        if (nameToClean.length > 14) {
            console.log('recreating speaker name');
            // remove all numbers from the speaker name
            // remove text 'audio_only' from the speaker name
            // remove spaces and join with _
            nameToClean = nameToClean.replace('audio_only_', '').split('').filter((char: any) => {
                return !isNaN(char) ? false : true;
            }).join('');
            // remove _ from first and last position, if any
            if (nameToClean[0] === '_') {
                let nameToCleanArr = nameToClean.split('');
                nameToCleanArr[0] = '';
                nameToClean = nameToCleanArr.join('');
            }
            if (nameToClean[nameToClean.length - 1] === '_') {
                let nameToCleanArr = nameToClean.split('');
                nameToCleanArr[nameToClean.length - 1] = '';
            }
        }
        console.log('cleaned name is ', nameToClean);
        return nameToClean;
    }

    addSpeakerNameInData(speakerName, JSONData) {
        speakerName = this.cleanSpeakerName(speakerName);
        console.log('adding speaker ' + speakerName + ' to the data');
        try {
            const newJSONData = {
                alternatives: [
                    {
                        words: [],
                    },
                ],
            };
            newJSONData.alternatives[0].words = JSONData.alternatives[0].words.map(wordObj => {
                wordObj['speakerTag'] = speakerName;
                return {...wordObj, speakerName};
            });
            console.log('speaker name assigned', newJSONData.alternatives[0].words[0]);
            return newJSONData;
        } catch (e) {
            console.log('An error occured while assigning speaker name');
            console.log(e);
            return undefined;
        }
    }

    getFolderStruture(addrToConsume: string): object {
        const sourceExtention = '.wav';
        const targetExtention = '.json';
        // if addr is url/someurl/filename.wav
        // then parent folder should be someurl, filename should be filname.json
        const FolderNamesArray = addrToConsume.split('/');
        let parentFolderName = '';

        if (FolderNamesArray[FolderNamesArray.length - 1].replace(' ', '_') !== 'audio_only' + sourceExtention) {
            parentFolderName = FolderNamesArray[FolderNamesArray.length - 2].replace(' ', '_');
        } else {
            console.log('ignoring audio file');

        }
        let fileName;
        if (path.extname(FolderNamesArray[FolderNamesArray.length - 1]).toLowerCase() === sourceExtention) {
            fileName = FolderNamesArray[FolderNamesArray.length - 1].replace(sourceExtention, targetExtention);
        }
        return {
            parentFolderName: !!parentFolderName ? parentFolderName : null ,
            fileName,
        };
    }

    cleanCombinedFile(parentFolderName) {
        console.log('cleaning combined folder if any for ', parentFolderName);
        const combinedFileAddr = path.join(this.DEST_COMPLETE_DIARIZATION_URL, parentFolderName, 'combined_diarization.json');
        try {
            fs.writeFileSync(combinedFileAddr, '', {encoding: 'utf-8'});
            console.log('file cleaned');
        } catch (e) {
            console.log('An error occured while cleaning the combined file prior starting the process !! You might face some issues while writing');
        }
    }
}
