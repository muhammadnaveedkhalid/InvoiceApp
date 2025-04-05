import { NextResponse } from 'next/server'
import { fetchInvoices, getInvoiceById } from '@/lib/quickbooks/api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const invoiceId = searchParams.get('id')

    if (invoiceId) {
      const invoice = await getInvoiceById(invoiceId)
      return NextResponse.json(invoice)
    } else {
      const invoices = await fetchInvoices()
      return NextResponse.json(invoices)
    }
  } catch (error: any) {
    console.error('QuickBooks API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
} 