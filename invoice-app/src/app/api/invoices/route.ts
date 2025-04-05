import { NextResponse } from 'next/server'

// Mock API URL - in a real app, this would be your actual API endpoint
const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  try {
    // If ID is provided, fetch specific invoice
    if (id) {
      const response = await fetch(`${MOCK_API_URL}/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
        }
        throw new Error('Failed to fetch invoice')
      }
      
      const data = await response.json()
      // Transform the data to match our invoice structure
      const invoice = {
        Id: data.id.toString(),
        DocNumber: `INV-${data.id}`,
        TxnDate: new Date().toISOString().split('T')[0],
        DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        TotalAmt: data.id * 100,
        Balance: data.id * 100,
        CustomerRef: {
          name: `Customer ${data.id}`
        },
        Line: [],
        CustomerMemo: { value: data.title }
      }
      
      return NextResponse.json(invoice)
    }
    
    // If no ID, fetch all invoices
    const response = await fetch(MOCK_API_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch invoices')
    }
    
    const data = await response.json()
    // Transform the data to match our invoice structure
    const invoices = data.map((item: any) => ({
      Id: item.id.toString(),
      DocNumber: `INV-${item.id}`,
      TxnDate: new Date().toISOString().split('T')[0],
      DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      TotalAmt: item.id * 100,
      Balance: item.id * 100,
      CustomerRef: {
        name: `Customer ${data.id}`
      },
      Line: [],
      CustomerMemo: { value: item.title }
    }))
    
    return NextResponse.json(invoices)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice data' },
      { status: 500 }
    )
  }
}

export async function GET_BY_ID(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 })
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const invoice = mockInvoices.find(inv => 
    inv.Id === id || 
    inv.DocNumber === id ||
    inv.DocNumber === `INV-${id}` ||
    inv.DocNumber === `inv-${id}`
  )

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  return NextResponse.json(invoice)
} 