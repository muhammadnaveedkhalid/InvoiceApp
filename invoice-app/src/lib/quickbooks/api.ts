import { Invoice } from '@/types/invoice'
import OAuthClient from 'intuit-oauth'
import QuickBooks from 'node-quickbooks'
import { mockInvoices } from '../mock/invoices'

const oauthClient = new OAuthClient({
  clientId: process.env.QUICKBOOKS_CLIENT_ID!,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
})

let qbo: QuickBooks | null = null

export const initializeQBO = (accessToken: string, realmId: string) => {
  try {
    qbo = new QuickBooks(
      process.env.QUICKBOOKS_CLIENT_ID!,
      process.env.QUICKBOOKS_CLIENT_SECRET!,
      accessToken,
      process.env.NODE_ENV !== 'production',
      realmId
    )
    return true
  } catch (error) {
    console.error('Failed to initialize QuickBooks client:', error)
    return false
  }
}

const checkClientInitialized = () => {
  if (!qbo) {
    return false
  }
  return true
}

const mapQuickBooksInvoice = (qbInvoice: any): Invoice => {
  return {
    Id: qbInvoice.Id,
    DocNumber: qbInvoice.DocNumber || `INV-${qbInvoice.Id}`,
    TxnDate: qbInvoice.TxnDate,
    DueDate: qbInvoice.DueDate,
    TotalAmt: qbInvoice.TotalAmt || 0,
    Balance: qbInvoice.Balance || qbInvoice.TotalAmt || 0,
    CustomerRef: {
      name: qbInvoice.CustomerRef?.name || 'Unknown Customer'
    },
    Line: (qbInvoice.Line || []).map((line: any) => ({
      Id: line.Id,
      LineNum: line.LineNum,
      Description: line.Description || '',
      Amount: line.Amount || 0,
      DetailType: line.DetailType,
      SalesItemLineDetail: line.SalesItemLineDetail ? {
        ItemRef: {
          value: line.SalesItemLineDetail.ItemRef?.value || '',
          name: line.SalesItemLineDetail.ItemRef?.name || ''
        },
        UnitPrice: line.SalesItemLineDetail.UnitPrice || 0,
        Qty: line.SalesItemLineDetail.Qty || 0
      } : undefined
    })),
    CustomerMemo: qbInvoice.CustomerMemo ? { value: qbInvoice.CustomerMemo.value } : undefined,
    PrivateNote: qbInvoice.PrivateNote,
    EmailStatus: qbInvoice.EmailStatus,
    DeliveryInfo: qbInvoice.DeliveryInfo ? {
      DeliveryType: qbInvoice.DeliveryInfo.DeliveryType,
      DeliveryTime: qbInvoice.DeliveryInfo.DeliveryTime
    } : undefined
  }
}

export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    if (!checkClientInitialized()) {
      return mockInvoices
    }
    
    return new Promise((resolve, reject) => {
      qbo!.findInvoices({ limit: 100, desc: 'Invoice' }, (err: any, invoices: any) => {
        if (err) {
          console.error('Error fetching invoices:', err)
          resolve(mockInvoices)
        } else {
          resolve(invoices.QueryResponse.Invoice.map(mapQuickBooksInvoice))
        }
      })
    })
  } catch (error) {
    console.error('Error in fetchInvoices:', error)
    return mockInvoices
  }
}

export const getInvoiceById = async (id: string): Promise<Invoice> => {
  try {
    if (!checkClientInitialized()) {
      const cleanId = id.replace(/^(?:inv-)?#?\s*/i, '').trim()
      
      let invoice = mockInvoices.find(inv => inv.DocNumber === id)
      
      if (!invoice) {
        invoice = mockInvoices.find(inv => inv.Id === cleanId)
      }
      
      if (invoice) {
        return invoice
      }
      throw new Error(`Invoice #${id} not found. Please check the invoice number and try again.`)
    }
    
    const cleanId = id.replace(/^(?:inv-)?#?\s*/i, '').trim()
    
    return new Promise((resolve, reject) => {
      qbo!.getInvoice(cleanId, (err: any, invoice: any) => {
        if (err) {
          console.error('Error fetching invoice:', err)
          if (err.statusCode === 404) {
            reject(new Error(`Invoice #${id} not found. Please check the invoice number and try again.`))
          } else {
            reject(new Error('Failed to fetch invoice. Please check your QuickBooks connection.'))
          }
        } else {
          resolve(mapQuickBooksInvoice(invoice))
        }
      })
    })
  } catch (error) {
    console.error('Error in getInvoiceById:', error)
    const cleanId = id.replace(/^(?:inv-)?#?\s*/i, '').trim()
    const invoice = mockInvoices.find(inv => inv.DocNumber === id || inv.Id === cleanId)
    if (invoice) {
      return invoice
    }
    throw error
  }
}

export const getAuthUrl = () => {
  try {
    return oauthClient.authorizeUri({
      scope: [
        OAuthClient.scopes.Accounting,
        OAuthClient.scopes.OpenId,
        OAuthClient.scopes.Profile,
        OAuthClient.scopes.Email,
      ],
      state: 'teststate',
    })
  } catch (error) {
    console.error('Error generating auth URL:', error)
    throw new Error('Failed to generate QuickBooks authorization URL')
  }
}

export async function handleCallback(url: string) {
  try {
    const authResponse = await oauthClient.createToken(url)
    const token = authResponse.getJson()
    
    if (token.realmId) {
      initializeQBO(token.access_token, token.realmId)
    }
    
    return token
  } catch (error) {
    console.error('Error handling callback:', error)
    throw new Error('Failed to complete QuickBooks authorization')
  }
} 