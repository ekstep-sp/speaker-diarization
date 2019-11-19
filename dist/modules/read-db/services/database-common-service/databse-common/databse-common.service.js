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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const database_utility_service_1 = require("../../database-utility-service/database-utility.service");
const speaker_merger_core_service_1 = require("../../../../speaker-merger/services/speaker-merger-core-service/speaker-merger-core.service");
let DatabseCommonService = class DatabseCommonService {
    constructor(dbUtiiltySrvc, speakerMergerSrvc) {
        this.dbUtiiltySrvc = dbUtiiltySrvc;
        this.speakerMergerSrvc = speakerMergerSrvc;
        this.DB_URL = path.resolve(__dirname, './../../../../../assets/vis_db');
        this.DIARIZATION_DB_URL = path.resolve(__dirname, './../../../../../assets/diarization_db');
    }
    readJSONdb() {
        console.log('reading from file', this.DB_URL);
        const fileUrl = path.join(this.DB_URL, 'vis_db.json');
        const fileData = fs.readFileSync(fileUrl, { encoding: 'utf-8' });
        return fileData;
    }
    readDiarizationDB(sessionFolderName) {
        const sourceDir = path.join(this.DIARIZATION_DB_URL, sessionFolderName);
        if (fs.existsSync(sourceDir)) {
            console.log('directory exisits');
            const fileNames = this.dbUtiiltySrvc.listFilesInDirectory(sourceDir);
            if (fileNames && fileNames.length > 0) {
                return fileNames;
            }
            else {
                return [];
            }
        }
        else {
            console.log('location not found --> ', sourceDir);
            return undefined;
        }
    }
    readDiarizationFile(fileName, directoryName) {
        const url = path.join(this.DIARIZATION_DB_URL, directoryName, fileName);
        console.log('reading ' + url);
        try {
            const fileContents = fs.readFileSync(url, { encoding: 'utf-8' });
            return fileContents;
        }
        catch (e) {
            console.log('error occured while reading file ', fileName);
            console.log(e);
            return undefined;
        }
    }
    appendToCombinedFile(currentFileName, currentFileContents, parentFolderName) {
        console.log('current file name is ', currentFileName);
        try {
            const JSONData = JSON.parse(currentFileContents);
            const filteredContent = this.dbUtiiltySrvc.getDiarizationSection(JSONData);
            const isFilePresent = this.dbUtiiltySrvc.checkOrCreateFile(parentFolderName);
            if (isFilePresent) {
                console.log('directory structure is present for ', currentFileName);
                const currentSpeakerName = currentFileName.replace(path.extname(currentFileName), '').trim();
                console.log('current speaker name is ', currentSpeakerName);
                const response = this.dbUtiiltySrvc.writeDiarizationContentsToFile(parentFolderName, filteredContent, currentSpeakerName);
                if (response['ok']) {
                    return true;
                }
                else {
                    console.log(response['error']);
                    return false;
                }
            }
            else {
                console.log('Cannot proceed further as some error occured while creating the corresponding directory structure for ', parentFolderName);
                return false;
            }
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    writeFilesToDiarizationDB(multipleDiarizationFilesData) {
        console.log('writing DIARIZATION DB FUNCTION CALLED');
        let totalFilesWritten = 0;
        let folderStructure;
        console.log('total files recieved to read ', multipleDiarizationFilesData.data.length);
        multipleDiarizationFilesData.data.forEach((fileData, index) => {
            console.log('inside ', index);
            if (fileData.uri.endsWith('audio_only.wav')) {
                totalFilesWritten += 1;
            }
            folderStructure = this.dbUtiiltySrvc.getFolderStruture(fileData.name);
            if (!!folderStructure['parentFolderName']) {
                console.log('folder structure is ', JSON.stringify(folderStructure) + '\n');
                const stringFileData = JSON.stringify(fileData.diarized_data) || '';
                const writeUrl = path.join(this.DIARIZATION_DB_URL, folderStructure['parentFolderName']);
                console.log('write url for file ', folderStructure['fileName'] + ' is ' + writeUrl + '\n\n');
                try {
                    if (!fs.existsSync(writeUrl)) {
                        fs.mkdirSync(writeUrl, { recursive: true });
                    }
                    else {
                        console.log(writeUrl + ' already exists, proceeding');
                    }
                    const completeFileUrl = path.join(writeUrl, folderStructure['fileName']);
                    console.log('file path now is ', completeFileUrl);
                    fs.writeFileSync(completeFileUrl, stringFileData, { encoding: 'utf-8' });
                    console.log('file written');
                    totalFilesWritten += 1;
                }
                catch (e) {
                    console.log('error occured while creating directories, ABORT');
                    console.log(e);
                    return {
                        ok: false,
                        error: 'Unexpected error while creating directories',
                    };
                }
            }
        });
        if (totalFilesWritten === multipleDiarizationFilesData.data.length) {
            console.log('files written successfully');
            this.speakerMergerSrvc.mergeSpeakers(folderStructure.parentFolderName);
        }
        else {
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
};
DatabseCommonService = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject(common_1.forwardRef(() => speaker_merger_core_service_1.SpeakerMergerCoreService))),
    __metadata("design:paramtypes", [database_utility_service_1.DatabaseUtilityService,
        speaker_merger_core_service_1.SpeakerMergerCoreService])
], DatabseCommonService);
exports.DatabseCommonService = DatabseCommonService;
//# sourceMappingURL=databse-common.service.js.map