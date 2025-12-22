import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuoteService {
  private prisma = new PrismaClient();

  async create(data: CreateQuoteDto) {
    const existingQuote = await this.prisma.quote.findUnique({
      where: { quoteNo: data.quoteNo },
    });

    if (existingQuote) {
      throw new BadRequestException('Quote number already exists');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const quote = await this.prisma.quote.create({
      data: {
        quoteNo: data.quoteNo,
        customerId: data.customerId,
        items: {
          create: data.items || [],
        },
      },
      include: { customer: true, items: true, onsiteRequests: true },
    });

    return quote;
  }

  async findAll() {
    const quotes = await this.prisma.quote.findMany({
      include: { customer: true, items: true, onsiteRequests: true },
      orderBy: { createdAt: 'desc' },
    });
    return quotes;
  }

  async findOne(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: { customer: true, items: true, onsiteRequests: true },
    });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    return quote;
  }

  async update(id: string, data: UpdateQuoteDto) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    if (data.quoteNo && data.quoteNo !== quote.quoteNo) {
      const existingQuote = await this.prisma.quote.findUnique({
        where: { quoteNo: data.quoteNo },
      });

      if (existingQuote) {
        throw new BadRequestException('Quote number already exists');
      }
    }

    if (data.customerId && data.customerId !== quote.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: data.customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
    }

    if (data.items) {
      await this.prisma.quoteItem.deleteMany({
        where: { quoteId: id },
      });
    }

    const updated = await this.prisma.quote.update({
      where: { id },
      data: {
        quoteNo: data.quoteNo,
        customerId: data.customerId,
        items: data.items ? { create: data.items } : undefined,
      },
      include: { customer: true, items: true, onsiteRequests: true },
    });

    return updated;
  }

  async delete(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    await this.prisma.quote.delete({
      where: { id },
    });

    return { message: 'Quote deleted successfully' };
  }

  async getByQuoteNo(quoteNo: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { quoteNo },
      include: { customer: true, items: true, onsiteRequests: true },
    });

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    return quote;
  }
}
