import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { QuoteService, CreateQuoteDto, UpdateQuoteDto } from './quote.service';

@ApiTags('Quotes')
@ApiBearerAuth('jwt')
@Controller('quotes')
@UseGuards(JwtGuard)
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @ApiOperation({
    summary: 'Buat quote baru',
    description: 'Membuat quote baru dengan items',
  })
  @Post()
  create(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quoteService.create(createQuoteDto);
  }

  @ApiOperation({
    summary: 'Dapatkan semua quotes',
    description: 'Mendapatkan daftar semua quotes dengan items dan onsite requests',
  })
  @Get()
  findAll() {
    return this.quoteService.findAll();
  }

  @ApiOperation({
    summary: 'Cari quote by nomor',
    description: 'Mencari quote berdasarkan nomor quote (001, 002, dll)',
  })
  @ApiParam({
    name: 'quoteNo',
    type: 'string',
    description: 'Nomor quote',
  })
  @Get('by-number/:quoteNo')
  getByQuoteNo(@Param('quoteNo') quoteNo: string) {
    return this.quoteService.getByQuoteNo(quoteNo);
  }

  @ApiOperation({
    summary: 'Dapatkan detail quote',
    description: 'Mendapatkan detail quote by ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID quote',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quoteService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update quote',
    description: 'Mengupdate data quote',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID quote',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.quoteService.update(id, updateQuoteDto);
  }

  @ApiOperation({
    summary: 'Hapus quote',
    description: 'Menghapus quote dari sistem',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID quote',
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.quoteService.delete(id);
  }
}
