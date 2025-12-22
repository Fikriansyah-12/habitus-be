import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Response,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { ExportService } from '../export/export.service';

@ApiTags('Quotes')
@ApiBearerAuth('jwt')
@Controller('quotes')
@UseGuards(JwtGuard)
export class QuoteController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly exportService: ExportService,
  ) {}

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
    summary: 'Export quotes ke Excel',
    description: 'Download semua quotes dalam format Excel',
  })
  @Get('export/excel')
  async exportToExcel(@Response() res: any) {
    const quotes = await this.quoteService.findAll();

    const quotesData = this.exportService.formatQuotesForExport(quotes);
    const itemsData = this.exportService.formatQuoteItemsForExport(quotes);

    const buffer = this.exportService.generateExcelBufferMultipleSheets([
      { name: 'Quotes', data: quotesData },
      { name: 'Items', data: itemsData },
    ]);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=quotes.xlsx');
    res.end(buffer);
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
