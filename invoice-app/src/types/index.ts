export interface LineItem {
  Id: string
  LineNum: number
  Description: string
  Amount: number
  DetailType: string
  SalesItemLineDetail?: {
    ItemRef: {
      value: string
      name: string
    }
    UnitPrice: number
    Qty: number
  }
}

export interface Invoice {
  Id: string
  DocNumber: string
  TxnDate: string
  DueDate: string
  TotalAmt: number
  Balance: number
  CustomerRef: {
    name: string
  }
  Line: LineItem[]
  CustomerMemo?: {
    value: string
  }
  PrivateNote?: string
  EmailStatus?: string
  DeliveryInfo?: {
    DeliveryType: string
    DeliveryTime: string
  }
} 