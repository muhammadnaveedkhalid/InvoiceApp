'use client'

import { useState } from 'react'
import InvoicePanel from './components/InvoicePanel'
import AIChat from './components/AIChat'
import ToolsPanel from './components/ToolsPanel'

export default function Home() {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  return (
    <div className="flex h-screen">
      {/* Left Panel - Invoices */}
      <div className="w-1/4 border-r">
        <InvoicePanel
          selectedInvoiceId={selectedInvoiceId}
          onSelectInvoice={setSelectedInvoiceId}
        />
      </div>

      {/* Right Panel - Chat and Tools */}
      <div className="w-3/4 flex flex-col">
        <div className="flex-1 h-[70vh]">
          <AIChat onSelectInvoice={setSelectedInvoiceId} />
        </div>
        <div className="h-[30vh] border-t">
          <ToolsPanel />
        </div>
      </div>
    </div>
  )
} 