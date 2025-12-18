import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, OnsideStatus } from '@prisma/client';
import { CreateOnsiteRequestDto, UpdateOnsiteRequestDto, UpdateOnsiteRequestStatusDto } from './dto/create-onsite-request.dto';

@Injectable()
export class OnsiteRequestService {
  private prisma = new PrismaClient();

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

    return request;
  }

  async findAll(filters?: { status?: OnsideStatus; quoteId?: string }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.quoteId) {
      where.quoteId = filters.quoteId;
    }

    const requests = await this.prisma.onsiteRequest.findMany({
      where,
      include: {
        requestedBy: { select: { id: true, name: true, email: true } },
        quote: { include: { customer: true } },
        items: true,
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

  async updateStatus(id: string, updateStatusDto: UpdateOnsiteRequestStatusDto) {
    const request = await this.prisma.onsiteRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Onsite request not found');
    }

    const updated = await this.prisma.onsiteRequest.update({
      where: { id },
      data: { status: updateStatusDto.status },
      include: {
        requestedBy: { select: { id: true, name: true, email: true } },
        quote: { include: { customer: true } },
        items: true,
      },
    });

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
