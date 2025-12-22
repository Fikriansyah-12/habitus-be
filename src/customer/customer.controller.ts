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
import { CustomerService } from './customer.service';
import { ExportService } from '../export/export.service';

@ApiTags('Customers')
@ApiBearerAuth('jwt')
@Controller('customers')
@UseGuards(JwtGuard)
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly exportService: ExportService,
  ) {}

  @ApiOperation({
    summary: 'Buat customer baru',
    description: 'Membuat data customer baru',
  })
  @Post()
  create(@Body() data: { name: string; phone: string }) {
    return this.customerService.create(data);
  }

  @ApiOperation({
    summary: 'Dapatkan semua customers',
    description: 'Mendapatkan daftar semua customers dengan quotes mereka',
  })
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @ApiOperation({
    summary: 'Dapatkan detail customer',
    description: 'Mendapatkan detail customer by ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID customer',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update customer',
    description: 'Mengupdate data customer',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID customer',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<{ name: string; phone: string }>) {
    return this.customerService.update(id, data);
  }

  @ApiOperation({
    summary: 'Export customers ke Excel',
    description: 'Download semua customers dalam format Excel',
  })
  @Get('export/excel')
  async exportToExcel(@Response() res: any) {
    const customers = await this.customerService.findAll();
    const customersData = this.exportService.formatCustomersForExport(customers);

    const buffer = this.exportService.generateExcelBuffer(customersData, 'Customers');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.xlsx');
    res.end(buffer);
  }

  @ApiOperation({
    summary: 'Hapus customer',
    description: 'Menghapus customer dari sistem',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID customer',
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.customerService.delete(id);
  }
}

