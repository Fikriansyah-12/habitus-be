import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExportService {
  generateExcelBuffer(
    data: Array<Record<string, any>>,
    sheetName: string,
  ): Buffer {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  }

  generateExcelBufferMultipleSheets(
    sheets: Array<{ name: string; data: Record<string, any>[] }>,
  ): Buffer {
    const workbook = XLSX.utils.book_new();

    for (const sheet of sheets) {
      const worksheet = XLSX.utils.json_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    }

    return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  }

  formatOnsiteRequestsForExport(
    requests: any[],
  ): Array<Record<string, any>> {
    return requests.map((req) => ({
      'Request ID': req.id,
      'Status': req.status,
      'Purpose': req.purpose,
      'Requested Date': new Date(req.createdAt).toLocaleDateString('id-ID'),
      'Onsite Date': new Date(req.onsiteAt).toLocaleDateString('id-ID'),
      'Onsite Time': new Date(req.onsiteAt).toLocaleTimeString('id-ID'),
      'Address': req.address,
      'Customer': req.quote?.customer?.name || '-',
      'Quote No': req.quote?.quoteNo || '-',
      'Requested By': req.requestedBy?.name || '-',
    }));
  }

  formatOnsiteItemsForExport(requests: any[]): Array<Record<string, any>> {
    const items: Array<Record<string, any>> = [];

    for (const req of requests) {
      if (req.items && req.items.length > 0) {
        for (const item of req.items) {
          items.push({
            'Request ID': req.id,
            'Item Name': item.name,
            'Quantity': item.qty,
          });
        }
      }
    }

    return items;
  }

  formatOnsiteLogsForExport(requests: any[]): Array<Record<string, any>> {
    const logs: Array<Record<string, any>> = [];

    for (const req of requests) {
      if (req.logs && req.logs.length > 0) {
        for (const log of req.logs) {
          logs.push({
            'Request ID': req.id,
            'Action': log.action,
            'Status From': log.oldStatus || '-',
            'Status To': log.newStatus || '-',
            'Changed By': log.changedBy?.name || '-',
            'Description': log.description,
            'Timestamp': new Date(log.timestamp).toLocaleString('id-ID'),
          });
        }
      }
    }

    return logs;
  }

  formatQuotesForExport(quotes: any[]): Array<Record<string, any>> {
    return quotes.map((quote) => ({
      'Quote ID': quote.id,
      'Quote No': quote.quoteNo,
      'Customer': quote.customer?.name || '-',
      'Phone': quote.customer?.phone || '-',
      'Created Date': new Date(quote.createdAt).toLocaleDateString('id-ID'),
      'Updated Date': new Date(quote.updatedAt).toLocaleDateString('id-ID'),
    }));
  }

  formatQuoteItemsForExport(quotes: any[]): Array<Record<string, any>> {
    const items: Array<Record<string, any>> = [];

    for (const quote of quotes) {
      if (quote.items && quote.items.length > 0) {
        for (const item of quote.items) {
          items.push({
            'Quote ID': quote.id,
            'Quote No': quote.quoteNo,
            'Item Name': item.name,
            'Quantity': item.qty,
          });
        }
      }
    }

    return items;
  }

  formatCustomersForExport(customers: any[]): Array<Record<string, any>> {
    return customers.map((customer) => ({
      'Customer ID': customer.id,
      'Name': customer.name,
      'Phone': customer.phone,
      'Created Date': new Date(customer.createdAt).toLocaleDateString('id-ID'),
      'Updated Date': new Date(customer.updatedAt).toLocaleDateString('id-ID'),
    }));
  }
}
