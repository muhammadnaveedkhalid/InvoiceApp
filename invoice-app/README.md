# Invoice Management Tool

An AI-powered invoice management application that integrates with QuickBooks Online and uses the Vercel AI SDK for natural language processing of invoice data.

## Features

- QuickBooks Online integration for invoice management
- AI-powered chat interface for invoice queries
- Real-time invoice data display
- Dual-panel interface for easy navigation
- Secure OAuth authentication with QuickBooks

## Prerequisites

- Node.js 16.x or later
- QuickBooks Developer account
- OpenAI API key
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd invoice-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
QUICKBOOKS_CLIENT_ID=your_client_id_here
QUICKBOOKS_CLIENT_SECRET=your_client_secret_here
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Set up QuickBooks OAuth:
   - Go to the QuickBooks Developer Dashboard
   - Create a new app
   - Set the OAuth redirect URL to: `http://localhost:3000/api/auth/callback`
   - Copy the client ID and secret to your `.env.local` file

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click "Connect to QuickBooks" to authenticate your account
2. Once connected, your invoices will appear in the left panel
3. Select an invoice to view its details
4. Use the chat interface on the right to ask questions about your invoices

## AI Features

The AI assistant can help you with:
- Understanding invoice details
- Analyzing payment patterns
- Explaining charges and line items
- Providing insights about your invoicing

## Development

- `src/app/` - Next.js application routes and API endpoints
- `src/components/` - React components
- `src/lib/` - Utility functions and API integrations
- `src/types/` - TypeScript type definitions

## Security

- OAuth tokens are stored securely in HTTP-only cookies
- All API routes are protected with proper authentication
- Environment variables are used for sensitive data
- HTTPS is enforced in production

## License

MIT License - See LICENSE file for details 