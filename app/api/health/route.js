import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(
      { 
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'horizon-africa-backend'
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
