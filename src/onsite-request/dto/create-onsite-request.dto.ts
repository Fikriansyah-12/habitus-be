import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsArray, ValidateNested, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OnsitePurpose, OnsideStatus } from '@prisma/client';

export class CreateOnsiteRequestItemDto {
  @ApiProperty({
    example: 'Bakpau Handle',
    description: 'Nama item',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 2,
    description: 'Jumlah item',
  })
  @IsInt()
  @Min(1)
  qty: number;
}

export class CreateOnsiteRequestDto {
  @ApiProperty({
    enum: OnsitePurpose,
    example: 'PENGIRIMAN_BARANG',
    description: 'Tujuan onsite (PENGIRIMAN_BARANG, MEETING, SURVEY, DOKUMENTASI)',
  })
  @IsEnum(OnsitePurpose)
  @IsNotEmpty()
  purpose: OnsitePurpose;

  @ApiProperty({
    example: '2025-12-25T09:00:00Z',
    description: 'Tanggal dan waktu onsite (ISO 8601 format)',
  })
  @IsDateString()
  @IsNotEmpty()
  onsiteAt: string;

  @ApiProperty({
    example: 'Jl. Merdeka No. 123, Jakarta',
    description: 'Alamat lokasi onsite',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'quote-001',
    description: 'ID Quote yang terkait',
  })
  @IsString()
  @IsNotEmpty()
  quoteId: string;

  @ApiProperty({
    type: [CreateOnsiteRequestItemDto],
    description: 'Daftar item untuk onsite request',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOnsiteRequestItemDto)
  @IsOptional()
  items?: CreateOnsiteRequestItemDto[];
}

export class UpdateOnsiteRequestStatusDto {
  @ApiProperty({
    enum: OnsideStatus,
    example: 'APPROVED',
    description: 'Status baru (REQUESTED, APPROVED, REJECTED)',
  })
  @IsEnum(OnsideStatus)
  @IsNotEmpty()
  status: OnsideStatus;
}

export class UpdateOnsiteRequestDto {
  @ApiProperty({
    enum: OnsitePurpose,
    example: 'MEETING',
    description: 'Tujuan onsite',
    required: false,
  })
  @IsEnum(OnsitePurpose)
  @IsOptional()
  purpose?: OnsitePurpose;

  @ApiProperty({
    example: '2025-12-26T10:00:00Z',
    description: 'Tanggal dan waktu onsite',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  onsiteAt?: string;

  @ApiProperty({
    example: 'Jl. Sudirman No. 456, Bandung',
    description: 'Alamat lokasi onsite',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    type: [CreateOnsiteRequestItemDto],
    description: 'Daftar item (akan mengganti item lama)',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOnsiteRequestItemDto)
  @IsOptional()
  items?: CreateOnsiteRequestItemDto[];
}

