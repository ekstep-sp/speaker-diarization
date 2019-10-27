import { Module } from '@nestjs/common';
import { ReadVisDbController } from './controllers/read-vis-db/read-vis-db.controller';
import { DatabseCommonService } from './services/database-common-service/databse-common/databse-common.service';

@Module({
    controllers: [ReadVisDbController],
    providers: [DatabseCommonService],
})
export class ReadDbModule {}
