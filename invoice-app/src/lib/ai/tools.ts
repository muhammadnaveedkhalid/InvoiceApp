import { z } from 'zod';
import { fetchInvoices, getInvoiceById } from '../quickbooks/api';
import { Invoice } from '@/types/invoice';

const invoiceSchema = z.object({
  id: z.string(),
});

const analyzeSchema = z.object({
  analysisType: z.enum(['trends', 'customer', 'amounts']),
  timeframe: z.enum(['week', 'month', 'year']).optional(),
});

export const invoiceTools = {
  getInvoice: {
    name: 'getInvoice',
    description: 'Get details of a specific invoice by ID',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The ID of the invoice to retrieve',
        },
      },
      required: ['id'],
    },
    validate: invoiceSchema.parse.bind(invoiceSchema),
    handler: async (args: z.infer<typeof invoiceSchema>) => {
      const invoice = await getInvoiceById(args.id);
      return invoice;
    },
  },
  listInvoices: {
    name: 'listInvoices',
    description: 'List all invoices',
    parameters: {
      type: 'object',
      properties: {},
    },
    validate: (args: any) => args,
    handler: async () => {
      const invoices = await fetchInvoices();
      return invoices;
    },
  },
  summarizeInvoice: {
    name: 'summarizeInvoice',
    description: 'Get a natural language summary of an invoice',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The ID of the invoice to summarize',
        },
      },
      required: ['id'],
    },
    validate: invoiceSchema.parse.bind(invoiceSchema),
    handler: async (args: z.infer<typeof invoiceSchema>) => {
      const invoice = await getInvoiceById(args.id);
      return {
        summary: `Invoice #${invoice.DocNumber} for ${invoice.CustomerRef.name}`,
        details: {
          amount: `$${invoice.TotalAmt}`,
          date: new Date(invoice.TxnDate).toLocaleDateString(),
          dueDate: new Date(invoice.DueDate).toLocaleDateString(),
          balance: `$${invoice.Balance}`,
          memo: invoice.CustomerMemo?.value || 'No memo'
        }
      };
    },
  },
  analyzeInvoices: {
    name: 'analyzeInvoices',
    description: 'Perform analysis of invoices',
    parameters: {
      type: 'object',
      properties: {
        analysisType: {
          type: 'string',
          enum: ['trends', 'customer', 'amounts'],
          description: 'Type of analysis to perform',
        },
        timeframe: {
          type: 'string',
          enum: ['week', 'month', 'year'],
          description: 'Time period to analyze',
        },
      },
      required: ['analysisType'],
    },
    validate: analyzeSchema.parse.bind(analyzeSchema),
    handler: async (args: z.infer<typeof analyzeSchema>) => {
      const invoices = await fetchInvoices();
      
      switch (args.analysisType) {
        case 'trends':
          const byDate = invoices.reduce((acc, inv) => {
            const date = new Date(inv.TxnDate).toLocaleDateString();
            acc[date] = (acc[date] || 0) + inv.TotalAmt;
            return acc;
          }, {} as Record<string, number>);
          return { type: 'trends', data: byDate };

        case 'customer':
          const byCustomer = invoices.reduce((acc, inv) => {
            const customer = inv.CustomerRef.name;
            acc[customer] = (acc[customer] || 0) + inv.TotalAmt;
            return acc;
          }, {} as Record<string, number>);
          return { type: 'customer', data: byCustomer };

        case 'amounts':
          const total = invoices.reduce((sum, inv) => sum + inv.TotalAmt, 0);
          const average = total / invoices.length;
          return {
            type: 'amounts',
            data: {
              total,
              average,
              count: invoices.length,
            },
          };
      }
    },
  },
}; 