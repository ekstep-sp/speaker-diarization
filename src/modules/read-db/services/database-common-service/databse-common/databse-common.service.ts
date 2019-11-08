import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabseCommonService {

    // '../../../../../../src/assets/vis_db'
    public DB_URL = path.resolve(__dirname, './../../../../../assets/vis_db');
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
}
