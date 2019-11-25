import { Controller, Post, Body, Res } from '@nestjs/common';
import { ZoomParserCoreService } from '../../services/zoom-parser-core-service/zoom-parser-core.service';

@Controller('zoom-to-vis')
export class ZoomToVisController {

    constructor(private zpcSrvc: ZoomParserCoreService) {}

    @Post('visualize')
    async ParseZoomResponseToVis(@Body() requestBody, @Res() response: any): Promise<any> {
        console.log('zoom-to-vis/visualize hit');

        const dataVisualized = await this.zpcSrvc.parseZoomDataForVis(requestBody);

        if (dataVisualized.ok) {
            response.status(200).send({status: 200, message: 'data has been successfully posted to network visualizer db'});
        } else {
            response.status(dataVisualized.status).send({status: dataVisualized.status, message: dataVisualized.error});
        }
    }
}
