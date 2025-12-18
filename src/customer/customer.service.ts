import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CustomerService {
  private prisma = new PrismaClient();

  async create(data: { name: string; phone: string }) {
    const customer = await this.prisma.customer.create({
      data,
    });
    return customer;
  }

  async findAll() {
    const customers = await this.prisma.customer.findMany({
      include: { quotes: true },
      orderBy: { createdAt: 'desc' },
    });
    return customers;
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { quotes: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: string, data: Partial<{ name: string; phone: string }>) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const updated = await this.prisma.customer.update({
      where: { id },
      data,
      include: { quotes: true },
    });

    return updated;
  }

  async delete(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await this.prisma.customer.delete({
      where: { id },
    });

    return { message: 'Customer deleted successfully' };
  }
}
