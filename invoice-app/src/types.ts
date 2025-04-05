export interface Invoice {
  Id: string;
  DocNumber: string;
  CustomerRef: {
    name: string;
  };
  TotalAmt: number;
  TxnDate: string;
} 