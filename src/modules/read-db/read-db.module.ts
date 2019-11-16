import { Module } from '@nestjs/common';
import { ReadVisDbController } from './controllers/read-vis-db/read-vis-db.controller';
import { DatabseCommonService } from './services/database-common-service/databse-common/databse-common.service';
import { DatabaseUtilityService } from './services/database-utility-service/database-utility.service';

@Module({
    controllers: [ReadVisDbController],
    providers: [DatabseCommonService, DatabaseUtilityService],
    exports: [DatabseCommonService, DatabaseUtilityService],
})
export class ReadDbModule {}
