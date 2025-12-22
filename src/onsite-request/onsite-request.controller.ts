import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Response,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { OnsiteRequestService } from './onsite-request.service';
import {
  CreateOnsiteRequestDto,
  UpdateOnsiteRequestDto,
  UpdateOnsiteRequestStatusDto,
} from './dto/create-onsite-request.dto';
import { OnsideStatus } from '@prisma/client';
import { ExportService } from '../export/export.service';

@ApiTags('Onsite Requests')
@ApiBearerAuth('jwt')
@Controller('onsite-requests')
@UseGuards(JwtGuard)
export class OnsiteRequestController {
  constructor(
    private readonly onsiteRequestService: OnsiteRequestService,
    private readonly exportService: ExportService,
  ) {}

  @ApiOperation({
    summary: 'Buat onsite request baru',
    description: 'Membuat request jadwal operasional baru dengan items',
  })
  @Post()
  create(@Request() req, @Body() createOnsiteRequestDto: CreateOnsiteRequestDto) {
    return this.onsiteRequestService.create(req.user.userId, createOnsiteRequestDto);
  }

  @ApiOperation({
    summary: 'Dapatkan semua onsite requests',
    description: 'Mendapatkan daftar semua onsite requests dengan opsi filter',
  })
  @ApiQuery({
    name: 'status',
    enum: OnsideStatus,
    required: false,
    description: 'Filter by status (REQUESTED, APPROVED, REJECTED)',
  })
  @ApiQuery({
    name: 'quoteId',
    type: 'string',
    required: false,
    description: 'Filter by quote ID',
  })
  @ApiQuery({
    name: 'purpose',
    type: 'string',
    required: false,
    description: 'Filter by purpose (PENGIRIMAN_BARANG, MEETING, SURVEY, DOKUMENTASI)',
  })
  @ApiQuery({
    name: 'startDate',
    type: 'string',
    required: false,
    description: 'Filter by start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'string',
    required: false,
    description: 'Filter by end date (YYYY-MM-DD)',
  })
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('quoteId') quoteId?: string,
    @Query('purpose') purpose?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    
    if (status && Object.values(OnsideStatus).includes(status as OnsideStatus)) {
      filters.status = status as OnsideStatus;
    }
    
    if (quoteId && quoteId.trim() !== '') {
      filters.quoteId = quoteId;
    }
    
    if (purpose && purpose.trim() !== '') {
      filters.purpose = purpose;
    }
    
    if (startDate || endDate) {
      filters.dateRange = {
        start: startDate ? new Date(startDate) : undefined,
        end: endDate ? new Date(endDate) : undefined,
      };
    }
    
    return this.onsiteRequestService.findAll(filters);
  }

  @ApiOperation({
    summary: 'Dapatkan statistik requests',
    description: 'Mendapatkan statistik jumlah requests berdasarkan status',
  })
  @Get('statistics')
  getStatistics() {
    return this.onsiteRequestService.getStatistics();
  }

  @ApiOperation({
    summary: 'Dapatkan detail onsite request',
    description: 'Mendapatkan detail lengkap satu onsite request by ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID onsite request',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.onsiteRequestService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update onsite request',
    description: 'Update detail request (hanya untuk status REQUESTED)',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID onsite request',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOnsiteRequestDto: UpdateOnsiteRequestDto,
  ) {
    return this.onsiteRequestService.update(id, updateOnsiteRequestDto);
  }

  @ApiOperation({
    summary: 'Update status request',
    description: 'Mengubah status request (REQUESTED → APPROVED → REJECTED)',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID onsite request',
  })
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() updateStatusDto: UpdateOnsiteRequestStatusDto,
  ) {
    return this.onsiteRequestService.updateStatus(id, updateStatusDto, req.user.userId);
  }

  @ApiOperation({
    summary: 'Dapatkan log/history onsite request',
    description: 'Mendapatkan semua activity log dari satu onsite request',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID onsite request',
  })
  @ApiQuery({
    name: 'action',
    type: 'string',
    required: false,
    description: 'Filter by action (CREATED, STATUS_CHANGED, ITEMS_UPDATED, dll)',
  })
  @Get(':id/logs')
  getRequestLogs(@Param('id') id: string, @Query('action') action?: string) {
    return this.onsiteRequestService.getRequestLogs(id, action);
  }

  @ApiOperation({
    summary: 'Dapatkan timeline onsite request',
    description: 'Mendapatkan timeline lengkap (chronological order) dari onsite request',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID onsite request',
  })
  @Get(':id/timeline')
  getRequestTimeline(@Param('id') id: string) {
    return this.onsiteRequestService.getRequestLogsTimeline(id);
  }

  @ApiOperation({
    summary: 'Export onsite requests ke Excel',
    description: 'Download semua onsite requests dalam format Excel dengan multiple sheets',
  })
  @ApiQuery({
    name: 'status',
    enum: OnsideStatus,
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'dateFrom',
    type: 'string',
    required: false,
    description: 'Filter dari tanggal (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'dateTo',
    type: 'string',
    required: false,
    description: 'Filter sampai tanggal (YYYY-MM-DD)',
  })
  @Get('export/excel')
  async exportToExcel(
    @Query('status') status?: OnsideStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Response() res?: any,
  ) {
    const requests = await this.onsiteRequestService.findAll(
      { status },
      dateFrom,
      dateTo,
    );

    const requestsData = this.exportService.formatOnsiteRequestsForExport(requests);
    const itemsData = this.exportService.formatOnsiteItemsForExport(requests);
    const logsData = this.exportService.formatOnsiteLogsForExport(requests);

    const buffer = this.exportService.generateExcelBufferMultipleSheets([
      { name: 'Requests', data: requestsData },
      { name: 'Items', data: itemsData },
      { name: 'Activity Logs', data: logsData },
    ]);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=onsite-requests.xlsx');
    res.end(buffer);
  }

  @ApiOperation({
    summary: 'Hapus onsite request',
    description: 'Menghapus onsite request dari sistem',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID onsite request',
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.onsiteRequestService.delete(id);
  }
}

