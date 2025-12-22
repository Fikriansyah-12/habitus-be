import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, OnsideStatus } from '@prisma/client';
import { CreateOnsiteRequestDto, UpdateOnsiteRequestDto, UpdateOnsiteRequestStatusDto } from './dto/create-onsite-request.dto';
import { OnsiteRequestLogService } from './onsite-request-log.service';

@Injectable()
export class OnsiteRequestService {
  private prisma = new PrismaClient();

  constructor(private logService: OnsiteRequestLogService) {}

  async create(userId: string, createOnsiteRequestDto: CreateOnsiteRequestDto) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: createOnsiteRequestDto.quoteId },
      include: { customer: true },
    });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    const request = await this.prisma.onsiteRequest.create({
      data: {
        requestedById: userId,
        purpose: createOnsiteRequestDto.purpose,
        onsiteAt: new Date(createOnsiteRequestDto.onsiteAt),
        address: createOnsiteRequestDto.address,
        quoteId: createOnsiteRequestDto.quoteId,
        items: {
          create: createOnsiteRequestDto.items || [],
        },
      },
      include: {
        requestedBy: { select: { id: true, name: true, email: true } },
        quote: { include: { customer: true } },
        items: true,
      },
    });

    await this.logService.createLog(
      request.id,
      'CREATED',
      userId,
      `Onsite request dibuat untuk quote ${quote.quoteNo}`,
      undefined,
      OnsideStatus.REQUESTED,
      {
        purpose: createOnsiteRequestDto.purpose,
        location: createOnsiteRequestDto.address,
      },
    );

    return request;
  }

  async findAll(filters?: any, dateFrom?: string, dateTo?: string) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.quoteId) {
      where.quoteId = filters.quoteId;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }

    if (filters?.purpose) {
      where.purpose = filters.purpose;
    }

    if (filters?.dateRange) {
      const onsiteAtFilter: any = {};
      if (filters.dateRange.start) {
        onsiteAtFilter.gte = filters.dateRange.start;
      }
      if (filters.dateRange.end) {
        onsiteAtFilter.lte = new Date(
          filters.dateRange.end.getTime() + 24 * 60 * 60 * 1000,
        );
      }
      if (Object.keys(onsiteAtFilter).length > 0) {
        where.onsiteAt = onsiteAtFilter;
      }
    }

    const requests = await this.prisma.onsiteRequest.findMany({
      where,
      include: {
        requestedBy: { select: { id: true, name: true, email: true } },
        quote: { include: { customer: true } },
        items: true,
        logs: {
          include: {
            changedBy: { select: { id: true, name: true, email: true } },
          },
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return requests;
  }

  async findOne(id: string) {
    const request = await this.prisma.onsiteRequest.findUnique({
      where: { id },
      include: {
        requestedBy: { select: { id: true, name: true, email: true } },
        quote: { include: { customer: true, items: true } },
        items: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Onsite request not found');
    }

    return request;
  }

  async update(id: string, updateOnsiteRequestDto: UpdateOnsiteRequestDto) {
    const request = await this.prisma.onsiteRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Onsite request not found');
    }

    if (request.status !== OnsideStatus.REQUESTED) {
      throw new BadRequestException('Can only update requests with REQUESTED status');
    }

    if (updateOnsiteRequestDto.items) {
      await this.prisma.onsideRequestItem.deleteMany({
        where: { requestId: id },
      });
    }

    const updated = await this.prisma.onsiteRequest.update({
      where: { id },
      data: {
        purpose: updateOnsiteRequestDto.purpose,
        onsiteAt: updateOnsiteRequestDto.onsiteAt
          ? new Date(updateOnsiteRequestDto.onsiteAt)
          : undefined,
        address: updateOnsiteRequestDto.address,
        items: updateOnsiteRequestDto.items
          ? { create: updateOnsiteRequestDto.items }
          : undefined,
      },
      include: {
        requestedBy: { select: { id: true, name: true, email: true } },
        quote: { include: { customer: true } },
        items: true,
      },
    });

    return updated;
  }

  async updateStatus(id: string, updateStatusDto: UpdateOnsiteRequestStatusDto, userId: string) {
    const request = await this.prisma.onsiteRequest.findUnique({
      where: { id },
      include: {
        requestedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!request) {
      throw new NotFoundException('Onsite request not found');
    }

    const oldStatus = request.status;
    const newStatus = updateStatusDto.status;

    const updated = await this.prisma.onsiteRequest.update({
      where: { id },
      data: { status: newStatus },
      include: {
        requestedBy: { select: { id: true, name: true, email: true } },
        quote: { include: { customer: true } },
        items: true,
      },
    });

    await this.logService.createLog(
      id,
      'STATUS_CHANGED',
      userId,
      `Status diubah dari ${oldStatus} menjadi ${newStatus}`,
      oldStatus,
      newStatus,
      updateStatusDto.metadata || {},
    );

    return updated;
  }

  async delete(id: string) {
    const request = await this.prisma.onsiteRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Onsite request not found');
    }

    await this.prisma.onsiteRequest.delete({
      where: { id },
    });

    return { message: 'Onsite request deleted successfully' };
  }

  async getRequestLogs(id: string, action?: string) {
    const request = await this.prisma.onsiteRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Onsite request not found');
    }

    return this.logService.getRequestLogs(id, action as any);
  }

  async getRequestLogsTimeline(id: string) {
    const request = await this.prisma.onsiteRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Onsite request not found');
    }

    return this.logService.getRequestLogsTimeline(id);
  }

  async getStatistics() {
    const total = await this.prisma.onsiteRequest.count();
    const requested = await this.prisma.onsiteRequest.count({
      where: { status: OnsideStatus.REQUESTED },
    });
    const approved = await this.prisma.onsiteRequest.count({
      where: { status: OnsideStatus.APPROVED },
    });
    const rejected = await this.prisma.onsiteRequest.count({
      where: { status: OnsideStatus.REJECTED },
    });

    return {
      total,
      requested,
      approved,
      rejected,
    };
  }
}
