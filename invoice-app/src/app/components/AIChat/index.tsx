import { useChat, type Message } from 'ai/react';
import { useState, useEffect } from 'react';
import { invoiceTools } from '@/lib/ai/tools';
import { z } from 'zod';

interface ToolState {
  isExecuting: boolean;
  currentTool: string | null;
  lastResult: any;
  steps: {
    tool: string;
    status: 'pending' | 'complete' | 'error';
    result?: any;
  }[];
}

interface AIChatProps {
  onSelectInvoice?: (id: string) => void;
}

export default function AIChat({ onSelectInvoice }: AIChatProps) {
  const [toolState, setToolState] = useState<ToolState>({
    isExecuting: false,
    currentTool: null,
    lastResult: null,
    steps: [],
  });
  const [showError, setShowError] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      // Handle the response if needed
    },
    onFinish: (message) => {
      // Handle when the message is complete
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  // Add effect to handle invoice mentions
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        const match = lastMessage.content.match(/invoice\s+(\d+)/i);
        if (match && match[1] && onSelectInvoice) {
          onSelectInvoice(match[1]);
        }
      }
    }
  }, [messages, onSelectInvoice]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    handleSubmit(e);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-lg px-6 py-4 max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {message.content}
              {message.role === 'assistant' && toolState.isExecuting && (
                <div className="mt-2 text-sm text-gray-500">
                  Executing {toolState.currentTool}...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tool Execution Steps */}
      {toolState.steps.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Tool Execution Steps:</h3>
          <div className="mt-2 space-y-2">
            {toolState.steps.map((step, index) => (
              <div key={index} className="flex items-center text-sm">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  step.status === 'complete' ? 'bg-green-500' :
                  step.status === 'error' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`} />
                <span>{step.tool}</span>
                <span className="ml-2 text-gray-500">
                  {step.status === 'complete' ? '✓' :
                   step.status === 'error' ? '✗' :
                   '...'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="p-6 border-t">
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-4">
            <input
              id="chat-input"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about your invoices..."
              className={`flex-1 px-6 py-4 border rounded-lg focus:outline-none focus:ring-2 text-lg ${
                showError && !input.trim() ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              disabled={isLoading || toolState.isExecuting}
            />
            <button
              type="submit"
              disabled={isLoading || toolState.isExecuting || !input.trim()}
              className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-lg"
            >
              Send
            </button>
          </div>
          {showError && !input.trim() && (
            <p className="text-sm text-red-500">Please enter a message</p>
          )}
        </div>
      </form>
    </div>
  );
} 