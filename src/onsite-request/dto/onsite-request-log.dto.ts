import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OnsideStatus } from '@prisma/client';

class ChangedByDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class OnsiteRequestLogDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  requestId: string;

  @ApiProperty({ enum: ['CREATED', 'STATUS_CHANGED', 'ITEMS_UPDATED', 'ADDRESS_UPDATED', 'SCHEDULE_CHANGED', 'CANCELLED'] })
  action: string;

  @ApiProperty({ nullable: true, enum: OnsideStatus })
  oldStatus?: OnsideStatus;

  @ApiProperty({ nullable: true, enum: OnsideStatus })
  newStatus?: OnsideStatus;

  @ApiProperty()
  changedBy: ChangedByDto;

  @ApiProperty()
  description: string;

  @ApiProperty({ nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty()
  timestamp: Date;
}

export class CreateOnsiteRequestLogDto {
  @ApiProperty({ enum: ['CREATED', 'STATUS_CHANGED', 'ITEMS_UPDATED', 'ADDRESS_UPDATED', 'SCHEDULE_CHANGED', 'CANCELLED'] })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ nullable: true, enum: OnsideStatus })
  @IsOptional()
  oldStatus?: OnsideStatus;

  @ApiProperty({ nullable: true, enum: OnsideStatus })
  @IsOptional()
  newStatus?: OnsideStatus;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  metadata?: Record<string, any>;
}
