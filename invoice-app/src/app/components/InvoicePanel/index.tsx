'use client'

import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Invoice } from '@/types'

interface InvoicePanelProps {
  selectedInvoiceId: string | null
  onSelectInvoice: (id: string) => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const fetchInvoices = async (): Promise<Invoice[]> => {
  const response = await fetch(`${API_BASE_URL}/api/invoices`)
  if (!response.ok) {
    throw new Error('Failed to fetch invoices')
  }
  return response.json()
}

export default function InvoicePanel({ selectedInvoiceId, onSelectInvoice }: InvoicePanelProps) {
  const { data: invoices, isLoading, error } = useQuery('invoices', fetchInvoices)

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        Error loading invoices. Please try again.
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Invoices</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {invoices?.map((invoice: Invoice) => (
          <div
            key={invoice.Id}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
              selectedInvoiceId === invoice.Id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectInvoice(invoice.Id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Invoice #{invoice.DocNumber}</h3>
                <p className="text-sm text-gray-500">
                  {invoice.CustomerRef.name}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${invoice.TotalAmt}</p>
                <p className="text-sm text-gray-500">
                  {new Date(invoice.TxnDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 