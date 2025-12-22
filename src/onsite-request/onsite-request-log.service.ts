import { Injectable } from '@nestjs/common';
import { PrismaClient, OnsideStatus } from '@prisma/client';

@Injectable()
export class OnsiteRequestLogService {
  private prisma = new PrismaClient();

  async createLog(
    requestId: string,
    action: string,
    changedById: string,
    description: string,
    oldStatus?: OnsideStatus,
    newStatus?: OnsideStatus,
    metadata?: Record<string, any>,
  ) {
    const log = await (this.prisma as any).onsiteRequestLog.create({
      data: {
        requestId,
        action,
        changedById,
        description,
        oldStatus,
        newStatus,
        metadata,
      },
      include: {
        changedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return log;
  }

  async getRequestLogs(requestId: string, action?: string) {
    const where: any = { requestId };
    if (action) {
      where.action = action;
    }

    const logs = await (this.prisma as any).onsiteRequestLog.findMany({
      where,
      include: {
        changedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    return logs;
  }

  async getRequestLogsTimeline(requestId: string) {
    const logs = await (this.prisma as any).onsiteRequestLog.findMany({
      where: { requestId },
      include: {
        changedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    return logs;
  }
}
