import { NextResponse } from 'next/server'
import { handleCallback } from '@/lib/quickbooks/api'

export async function GET(request: Request) {
  try {
    const token = await handleCallback(request.url)
    
    // In a real application, you would store the token securely
    // For demo purposes, we'll store it in a cookie
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('qbo_token', JSON.stringify(token), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })
    
    return response
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/error', request.url))
  }
} 