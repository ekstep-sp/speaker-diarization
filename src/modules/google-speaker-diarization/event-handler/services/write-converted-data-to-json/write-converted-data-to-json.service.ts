import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WriteConvertedDataToJsonService {
    public DB_URL = path.resolve(__dirname, './../../../../../assets/vis_db');

    initiate(dataToUse: object) {
        const fileUrl = path.join(this.DB_URL, 'vis_db.json');
        console.log('writing file on ', fileUrl);
        console.log(JSON.stringify(dataToUse));
        const readFileContents = fs.readFileSync(fileUrl, {encoding: 'utf-8'});
        const newFileContents = this.updateContentsOfFile(readFileContents, dataToUse);
        try {
            fs.writeFileSync(fileUrl, JSON.stringify(newFileContents));
            console.log('file written successfully, everything went okay');
        } catch (e) {
            console.log('Error occured while writing the file' , e);
        }
    }

    updateContentsOfFile(oldContents, newVideoData) {
        // convert to json if the file is not empty
        console.log('sending video data as ', newVideoData);
        oldContents = oldContents.length > 0 ? JSON.parse(oldContents) : {videos: []};
        const newVideoObject = {
            id: null,
            vname: `Random Video Z` ,
            vduration: '1 hr 20 mins',
            vheldOn: `01 Jan 2000`,
            vhubs: [],
            data: [],
        };

        const totalVideosInFile = oldContents.videos.length || 0;
        console.log('total videos in file ', totalVideosInFile);
        let newUpdatedDB = {};

        if (totalVideosInFile) {

            let isUpdated = false;
            newUpdatedDB['videos'] = [];
            newUpdatedDB['videos'] = oldContents.videos.filter(videoObj => {
                if (videoObj.vname === newVideoData.details.video_name) {
                    videoObj['vduration'] = newVideoData.details.video_duration || newVideoObject.vduration;
                    videoObj['vheldOn'] = newVideoData.details.video_held_on || newVideoObject.vheldOn;
                    videoObj['vhubs'] = newVideoData.details.hubs_name || newVideoObject.vhubs;
                    videoObj.data = newVideoData.data.data;
                    isUpdated = true;
                    console.log('file updated');
                }
                return true;
            });

            if (!isUpdated) {

                newVideoObject.id = oldContents.videos.length;  // since ids are starting from 0
                newVideoObject.vname = newVideoData.details.video_name || newVideoObject.vname;
                newVideoObject.vduration = newVideoData.details.video_duration || newVideoObject.vduration;
                newVideoObject.vheldOn = newVideoData.details.video_held_on || newVideoObject.vheldOn;
                newVideoObject.data = newVideoData.data.data;
                newVideoObject.vhubs = newVideoData.details.hubs_name || [];

                oldContents.videos.push(newVideoObject);

                newUpdatedDB = oldContents;
            }
        } else {
            console.log('there are no videos in the file, write a new one');
            newVideoObject.id = 0;
            newVideoObject.vname = newVideoData.details.video_name || newVideoObject.vname;
            newVideoObject.vduration = newVideoData.details.video_duration || newVideoObject.vduration;
            newVideoObject.vheldOn = newVideoData.details.video_held_on || newVideoObject.vheldOn;
            newVideoObject.data = newVideoData.data.data;
            newVideoObject.vhubs = newVideoData.details.hubs_name || [];

            newUpdatedDB['videos'] = [];
            newUpdatedDB['videos'].push(newVideoObject);
        }
        return newUpdatedDB;
    }
}
