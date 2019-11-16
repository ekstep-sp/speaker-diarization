import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SpeakerMergerUtilityService {
    private BASE_URL = path.resolve(__dirname, './../../../../assets/diarization_db/combined');

    sortCombinedDiarizationData(parentFolderName, fileName= 'combined_diarization.json') {
        // read the file, sort on the basis of timestamp, write it back
        const fileContents = fs.readFileSync(path.join(this.BASE_URL, parentFolderName, fileName), {encoding: 'utf-8'});
        // only sort if there is anything to sort
        const parsedFileContents = JSON.parse(fileContents);
        if (parsedFileContents.response.results[0].alternatives[0].words.length > 0) {
            let dataToSort = [...parsedFileContents.response.results[0].alternatives[0].words];
            dataToSort.sort((val1: string, val2: string): number => {
                // -1 if val1 is less than val2
                // 1 if val1 is greater than val2
                // 0 if val1 == val2 and sequence is to be preserved
                const ts1 = parseFloat(val1['startTime'].split('s')[0]);
                const ts2 = parseFloat(val2['startTime'].split('s')[0]);

                if (ts1 < ts2) {
                    return -1;
                } else if (ts1 > ts2) {
                    return 1;
                } else {
                    return 0;
                }
            });
            // assign back the sorted data
            parsedFileContents.response.results[0].alternatives[0].words = [...dataToSort];
            // write it back
            fs.writeFileSync(path.join(this.BASE_URL, parentFolderName, fileName), JSON.stringify(parsedFileContents), {encoding: 'utf-8'});
            console.log('sorted successfully');
        }
        console.log('no need to sort, data empty');
        return {
            ok: true,
            error: '',
        };
    }
}
