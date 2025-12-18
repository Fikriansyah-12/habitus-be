import { Module } from '@nestjs/common';
import { OnsiteRequestService } from './onsite-request.service';
import { OnsiteRequestController } from './onsite-request.controller';

@Module({
  controllers: [OnsiteRequestController],
  providers: [OnsiteRequestService],
  exports: [OnsiteRequestService],
})
export class OnsiteRequestModule {}
