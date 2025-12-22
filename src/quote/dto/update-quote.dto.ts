import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class QuoteItemDto {
  @ApiProperty({ example: 'Bakpau Handle' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  qty: number;
}

export class UpdateQuoteDto {
  @ApiProperty({ example: '001', description: 'Quote number', required: false })
  @IsOptional()
  @IsString()
  quoteNo?: string;

  @ApiProperty({ example: 'cust-001', description: 'Customer ID', required: false })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ type: [QuoteItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items?: QuoteItemDto[];
}
