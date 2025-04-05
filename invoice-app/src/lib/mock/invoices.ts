import { Invoice } from '@/types/invoice'

export const mockInvoices: Invoice[] = Array.from({ length: 100 }, (_, i) => {
  const invoiceNumber = i + 1
  const amount = (invoiceNumber * 100).toFixed(2)
  return {
    Id: invoiceNumber.toString(),
    DocNumber: `INV-${invoiceNumber}`,
    TxnDate: '2024-04-05',
    DueDate: '2024-05-05',
    TotalAmt: parseFloat(amount),
    Balance: parseFloat(amount),
    CustomerRef: {
      name: `Customer ${invoiceNumber}`
    },
    Line: [{
      Id: `${invoiceNumber}-1`,
      LineNum: 1,
      Description: `Invoice ${invoiceNumber} line item`,
      Amount: parseFloat(amount),
      DetailType: 'SalesItemLineDetail',
      SalesItemLineDetail: {
        ItemRef: {
          value: `${invoiceNumber}-1`,
          name: `Item ${invoiceNumber}`
        },
        UnitPrice: parseFloat(amount),
        Qty: 1
      }
    }],
    CustomerMemo: { value: `Invoice for Customer ${invoiceNumber}` }
  }
})
