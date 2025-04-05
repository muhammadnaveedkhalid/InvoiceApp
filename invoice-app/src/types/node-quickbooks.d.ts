declare module 'node-quickbooks' {
  export default class QuickBooks {
    constructor(
      clientId: string,
      clientSecret: string,
      accessToken: string,
      useSandbox: boolean,
      realmId: string
    );

    findInvoices(
      params: { limit: number; desc: string },
      callback: (err: any, invoices: any) => void
    ): void;

    getInvoice(
      id: string,
      callback: (err: any, invoice: any) => void
    ): void;
  }
} 