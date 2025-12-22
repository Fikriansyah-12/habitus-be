import { Module } from '@nestjs/common';
import { OnsiteRequestService } from './onsite-request.service';
import { OnsiteRequestController } from './onsite-request.controller';
import { OnsiteRequestLogService } from './onsite-request-log.service';
import { ExportModule } from '../export/export.module';

@Module({
  imports: [ExportModule],
  controllers: [OnsiteRequestController],
  providers: [OnsiteRequestService, OnsiteRequestLogService],
  exports: [OnsiteRequestService, OnsiteRequestLogService],
})
export class OnsiteRequestModule {}
