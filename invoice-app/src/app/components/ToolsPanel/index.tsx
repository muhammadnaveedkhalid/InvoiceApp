import { useState, useEffect } from 'react'
import { invoiceTools } from '@/lib/ai/tools'
import { Invoice } from '@/types/invoice'

interface ToolStatus {
  name: string
  status: 'idle' | 'executing' | 'completed' | 'error'
  result?: any
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export default function ToolsPanel() {
  const [toolStatus, setToolStatus] = useState<Record<string, ToolStatus>>(
    Object.keys(invoiceTools).reduce((acc, toolName) => ({
      ...acc,
      [toolName]: { name: toolName, status: 'idle' }
    }), {})
  )
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('')
  const [selectedTool, setSelectedTool] = useState('summarizeInvoice')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/invoices`)
        if (!response.ok) {
          throw new Error('Failed to fetch invoices')
        }
        const data = await response.json()
        setInvoices(data)
        if (data.length > 0) {
          setSelectedInvoiceId(data[0].Id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invoices')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const clearToolResults = () => {
    setToolStatus(prev => {
      const newStatus = { ...prev }
      Object.keys(newStatus).forEach(key => {
        newStatus[key] = { 
          ...newStatus[key], 
          status: 'idle',
          result: null 
        }
      })
      return newStatus
    })
  }

  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName)
    clearToolResults()
  }

  const handleToolClick = async (toolName: string) => {
    const tool = invoiceTools[toolName as keyof typeof invoiceTools]
    if (!tool) return

    setToolStatus(prev => {
      const newStatus = { ...prev }
      Object.keys(newStatus).forEach(key => {
        if (key !== toolName) {
          newStatus[key] = { 
            ...newStatus[key], 
            status: 'idle',
            result: null 
          }
        }
      })
      return {
        ...newStatus,
        [toolName]: { ...newStatus[toolName], status: 'executing' }
      }
    })

    try {
      let result
      if (toolName === 'getInvoice') {
        result = await tool.handler({ id: selectedInvoiceId })
      } else if (toolName === 'listInvoices') {
        result = await tool.handler({})
      } else if (toolName === 'summarizeInvoice') {
        result = await tool.handler({ id: selectedInvoiceId })
      } else if (toolName === 'analyzeInvoices') {
        result = await tool.handler({ analysisType: 'trends' })
      }

      setToolStatus(prev => ({
        ...prev,
        [toolName]: { 
          ...prev[toolName], 
          status: 'completed',
          result
        }
      }))
    } catch (error) {
      setToolStatus(prev => ({
        ...prev,
        [toolName]: { 
          ...prev[toolName], 
          status: 'error',
          result: error
        }
      }))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-gray-200'
      case 'executing': return 'bg-yellow-200'
      case 'completed': return 'bg-green-200'
      case 'error': return 'bg-red-200'
      default: return 'bg-gray-200'
    }
  }

  const renderResult = (result: any, toolName: string) => {
    if (!result) return null;

    if (toolName === 'summarizeInvoice') {
      return (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">{result.summary}</h4>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {result.details.balance}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">Amount:</span>
                <span className="ml-2 font-medium">{result.details.amount}</span>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="ml-2 font-medium">{result.details.date}</span>
              </div>
              <div>
                <span className="text-gray-500">Due Date:</span>
                <span className="ml-2 font-medium">{result.details.dueDate}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">Balance:</span>
                <span className="ml-2 font-medium">{result.details.balance}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Memo:</span>
                <p className="mt-1 p-2 bg-gray-50 rounded text-gray-700">
                  {result.details.memo}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-2 p-2 bg-gray-50 rounded">
        <pre className="text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="p-4 border-t">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Tools</h2>
        <p className="text-gray-600">Select an invoice and tool to analyze your data</p>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label htmlFor="invoice-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Invoice
            </label>
            <select
              id="invoice-select"
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {invoices.map((invoice) => (
                <option key={invoice.Id} value={invoice.Id}>
                  Invoice #{invoice.DocNumber} - {invoice.CustomerRef.name} (${invoice.TotalAmt})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="tool-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Tool
            </label>
            <select
              id="tool-select"
              value={selectedTool}
              onChange={(e) => handleToolSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(invoiceTools).map(([name, tool]) => (
                <option key={name} value={name}>
                  {tool.name} - {tool.description}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleToolClick(selectedTool)}
              disabled={toolStatus[selectedTool].status === 'executing' || !selectedInvoiceId}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 h-[42px]"
            >
              Execute
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(invoiceTools).map(([name, tool]) => (
          <div key={name} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-medium">{tool.name}</h4>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
              <button
                onClick={() => handleToolClick(name)}
                disabled={toolStatus[name].status === 'executing' || !selectedInvoiceId}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Execute
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(toolStatus[name].status)}`} />
              <span className="text-sm capitalize">{toolStatus[name].status}</span>
            </div>

            {toolStatus[name].result && renderResult(toolStatus[name].result, name)}
          </div>
        ))}
      </div>
    </div>
  )
} 