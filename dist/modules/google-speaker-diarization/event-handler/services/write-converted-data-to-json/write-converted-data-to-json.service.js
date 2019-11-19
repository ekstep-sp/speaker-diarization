"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let WriteConvertedDataToJsonService = class WriteConvertedDataToJsonService {
    constructor() {
        this.DB_URL = path.resolve(__dirname, './../../../../../assets/vis_db');
    }
    initiate(dataToUse) {
        const fileUrl = path.join(this.DB_URL, 'vis_db.json');
        console.log('writing file on ', fileUrl);
        console.log(JSON.stringify(dataToUse));
        const readFileContents = fs.readFileSync(fileUrl, { encoding: 'utf-8' });
        const newFileContents = this.updateContentsOfFile(readFileContents, dataToUse);
        try {
            fs.writeFileSync(fileUrl, JSON.stringify(newFileContents));
            console.log('file written successfully, everything went okay');
        }
        catch (e) {
            console.log('Error occured while writing the file', e);
        }
    }
    updateContentsOfFile(oldContents, newVideoData) {
        oldContents = oldContents.length > 0 ? JSON.parse(oldContents) : { videos: [] };
        const newVideoObject = {
            id: null,
            vname: `Random Video Z`,
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
                newVideoObject.id = oldContents.videos.length;
                newVideoObject.vname = newVideoData.details.video_name || newVideoObject.vname;
                newVideoObject.vduration = newVideoData.details.video_duration || newVideoObject.vduration;
                newVideoObject.vheldOn = newVideoData.details.video_held_on || newVideoObject.vheldOn;
                newVideoObject.data = newVideoData.data.data;
                newVideoObject.vhubs = newVideoData.details.hubs_name || [];
                oldContents.videos.push(newVideoObject);
                newUpdatedDB = oldContents;
            }
        }
        else {
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
};
WriteConvertedDataToJsonService = __decorate([
    common_1.Injectable()
], WriteConvertedDataToJsonService);
exports.WriteConvertedDataToJsonService = WriteConvertedDataToJsonService;
//# sourceMappingURL=write-converted-data-to-json.service.js.map