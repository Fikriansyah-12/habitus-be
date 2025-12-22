import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class QuoteItemDto {
  @ApiProperty({ example: 'Bakpau Handle' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  qty: number;
}

export class CreateQuoteDto {
  @ApiProperty({ example: '001', description: 'Quote number' })
  @IsString()
  @IsNotEmpty()
  quoteNo: string;

  @ApiProperty({ example: 'cust-001', description: 'Customer ID' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ type: [QuoteItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items?: QuoteItemDto[];
}
