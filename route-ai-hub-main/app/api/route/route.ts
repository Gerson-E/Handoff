import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idempotencyKey = request.headers.get('Idempotency-Key');
    
    const backendUrl = `${process.env.BACKEND_BASE_URL}/route`;
    const apiKey = process.env.BACKEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Backend API key not configured' }, { status: 500 });
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
    
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    const responseText = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';
    
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
      },
    });
    
  } catch (error) {
    console.error('Route API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}