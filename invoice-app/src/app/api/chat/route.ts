import { StreamingTextResponse, Message } from 'ai'
import { getInvoiceById, fetchInvoices } from '@/lib/quickbooks/api'
import { Invoice } from '@/types/invoice'

// Mock streaming response helper
async function* mockStreamResponse(message: string) {
  const encoder = new TextEncoder()
  const chunks = message.split(' ')
  for (const chunk of chunks) {
    yield encoder.encode(chunk + ' ')
    await new Promise(resolve => setTimeout(resolve, 50))
  }
}

// Chat response generator
async function* chatCompletion(messages: Message[]) {
  const lastMessage = messages[messages.length - 1].content.toLowerCase()
  
  // Simulate thinking time
  await new Promise(resolve => setTimeout(resolve, 500))
  
  try {
    // Handle greetings and general messages
    if (lastMessage.match(/^(hi|hello|hey|greetings|good (morning|afternoon|evening))$/i)) {
      yield {
        choices: [{
          delta: {
            content: "Hello! How can I help you with your invoices today?"
          }
        }]
      }
      return
    }

    // Handle different types of requests
    if (lastMessage.includes('show me invoice') || lastMessage.includes('get invoice')) {
      // Match various invoice number formats
      const match = lastMessage.match(/(?:show|get)(?:\s+me)?(?:\s+invoice)?\s+#?(?:inv-)?(\d+)/i)
      if (match) {
        try {
          const invoice = await getInvoiceById(match[1]) as Invoice
          yield {
            choices: [{
              delta: {
                content: `Here are the details for Invoice #${invoice.DocNumber}:\n` +
                        `Customer: ${invoice.CustomerRef.name}\n` +
                        `Amount: $${invoice.TotalAmt}\n` +
                        `Date: ${new Date(invoice.TxnDate).toLocaleDateString()}\n` +
                        `Balance: $${invoice.Balance}`
              }
            }]
          }
        } catch (error: any) {
          const invoices = await fetchInvoices() as Invoice[]
          yield {
            choices: [{
              delta: {
                content: `I'm sorry, but I couldn't find Invoice #${match[1]}. Here are the available invoice numbers:\n` +
                        invoices.map(inv => `- ${inv.DocNumber}`).join('\n')
              }
            }]
          }
        }
      } else {
        const invoices = await fetchInvoices() as Invoice[]
        yield {
          choices: [{
            delta: {
              content: "Please provide a valid invoice number. Here are your available invoices:\n\n" +
                      invoices.map(inv => `• Invoice #${inv.DocNumber} - ${inv.CustomerRef.name} ($${inv.TotalAmt})`).join('\n') +
                      "\n\nYou can use any of these formats:\n" +
                      "• show me invoice [number]\n" +
                      "• show me invoice INV-[number]\n" +
                      "• show me invoice #[number]"
            }
          }]
        }
      }
    } else if (lastMessage.includes('summarize invoice')) {
      const match = lastMessage.match(/summarize(?:\s+invoice)?\s+#?(?:inv-)?(\d+)/i)
      if (match) {
        try {
          const invoice = await getInvoiceById(match[1]) as Invoice
          yield {
            choices: [{
              delta: {
                content: `Invoice #${invoice.DocNumber} for ${invoice.CustomerRef.name} with total amount $${invoice.TotalAmt}, dated ${new Date(invoice.TxnDate).toLocaleDateString()}`
              }
            }]
          }
        } catch (error: any) {
          const invoices = await fetchInvoices() as Invoice[]
          yield {
            choices: [{
              delta: {
                content: `I'm sorry, but I couldn't find Invoice #${match[1]}. Here are the available invoice numbers:\n` +
                        invoices.map(inv => `- ${inv.DocNumber}`).join('\n')
              }
            }]
          }
        }
      }
    } else if (lastMessage.includes('list all invoices') || lastMessage.includes('show all invoices')) {
      const invoices = await fetchInvoices() as Invoice[]
      yield {
        choices: [{
          delta: {
            content: "Here are all your invoices:\n" + 
                    invoices.map(inv => `- Invoice #${inv.DocNumber}: ${inv.CustomerRef.name} - $${inv.TotalAmt}`).join('\n')
          }
        }]
      }
    } else {
      yield {
        choices: [{
          delta: {
            content: "I can help you with your invoices. You can ask me to:\n" +
                    "• Show a specific invoice (e.g., 'show me invoice 1')\n" +
                    "• List all invoices (e.g., 'show all invoices')\n" +
                    "• Summarize an invoice (e.g., 'summarize invoice 1')\n\n" +
                    "What would you like to know about your invoices?"
          }
        }]
      }
    }
  } catch (error: any) {
    yield {
      choices: [{
        delta: {
          content: "I'm having trouble accessing the invoice data. Please try again later."
        }
      }]
    }
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    // Create a ReadableStream from the chat completion
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatCompletion(messages)) {
            const content = chunk.choices[0].delta.content
            controller.enqueue(new TextEncoder().encode(content))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    })
  }
} 