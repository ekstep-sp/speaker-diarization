import { DatabaseUtilityService } from '../../database-utility-service/database-utility.service';
import { SpeakerMergerCoreService } from '../../../../speaker-merger/services/speaker-merger-core-service/speaker-merger-core.service';
export interface WRITE_DIARIZED_FILES_INTERFACE {
    data: Array<{
        diarized_data: any;
        bucket: string;
        name: string;
        uri: string;
    }>;
}
export declare class DatabseCommonService {
    private dbUtiiltySrvc;
    private speakerMergerSrvc;
    constructor(dbUtiiltySrvc: DatabaseUtilityService, speakerMergerSrvc: SpeakerMergerCoreService);
    DB_URL: string;
    DIARIZATION_DB_URL: string;
    readJSONdb(): string;
    readDiarizationDB(sessionFolderName: any): string[];
    readDiarizationFile(fileName: any, directoryName: any): string;
    appendToCombinedFile(currentFileName: any, currentFileContents: any, parentFolderName: any): boolean;
    writeFilesToDiarizationDB(multipleDiarizationFilesData: WRITE_DIARIZED_FILES_INTERFACE): {
        ok: boolean;
        error: string;
    };
}
