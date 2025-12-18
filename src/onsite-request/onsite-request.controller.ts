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

@ApiTags('Onsite Requests')
@ApiBearerAuth('jwt')
@Controller('onsite-requests')
@UseGuards(JwtGuard)
export class OnsiteRequestController {
  constructor(private readonly onsiteRequestService: OnsiteRequestService) {}

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
  @Get()
  findAll(@Query('status') status?: OnsideStatus, @Query('quoteId') quoteId?: string) {
    return this.onsiteRequestService.findAll({ status, quoteId });
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
    @Body() updateStatusDto: UpdateOnsiteRequestStatusDto,
  ) {
    return this.onsiteRequestService.updateStatus(id, updateStatusDto);
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

