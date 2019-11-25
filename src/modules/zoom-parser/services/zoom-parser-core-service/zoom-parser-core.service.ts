import { Injectable } from '@nestjs/common';
import { ZoomParserService } from '../../../network-parser/services/zoom-parser/zoom-parser.service';

@Injectable()
export class ZoomParserCoreService {
    constructor(private zpSrvc: ZoomParserService) {
        // nothing for now
    }

    async parseZoomDataForVis(dataToUse: object) {
        console.log('parser called');
        // function will read the json properly, remove noise if any, call the parser to parse to vis and finally save it to vis db
        const RequestBody = {...dataToUse};
        const response = await this.zpSrvc.parseDataForVis(RequestBody);
        if (response) {
            // data supplied seems valid, parse it and proceed
            console.log('data is sent');
            return {
                ok: true,
                error: '',
                status: 200,
            };
        } else {
            console.log('An error occured while sending data to visulaize');
            return {
                ok: false,
                error: 'An error occured while sending data to visulaize',
                status: 400,
            };
        }
    }
}
